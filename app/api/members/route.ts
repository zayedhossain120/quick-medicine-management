import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const db = await getDatabase();

    // Build query
    const query: any = { role: "member" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status !== "all") {
      query.status = status;
    }

    // Get total count
    const total = await db.collection("users").countDocuments(query);

    // Get members with pagination
    const members = await db
      .collection("users")
      .find(query)
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Calculate balance for each member
    const membersWithBalance = await Promise.all(
      members.map(async (member) => {
        const transactions = await db
          .collection("transactions")
          .find({ memberId: member._id, status: "completed" })
          .toArray();

        const deposits = transactions
          .filter((t) => t.type === "deposit")
          .reduce((sum, t) => sum + t.amount, 0);

        const withdrawals = transactions
          .filter((t) => t.type === "withdrawal")
          .reduce((sum, t) => sum + t.amount, 0);

        const profits = transactions
          .filter((t) => t.type === "profit")
          .reduce((sum, t) => sum + t.amount, 0);

        const balance = deposits + profits - withdrawals;

        return {
          ...member,
          balance,
          totalDeposits: deposits,
          totalWithdrawals: withdrawals,
          totalProfits: profits,
        };
      })
    );

    return NextResponse.json({
      members: membersWithBalance,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json();
    const {
      name,
      email,
      phone,
      joinDate,
      dob,
      occupation,
      address,
      image,
      password,
      role = "member",
    } = memberData;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = {
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || "",
      joinDate: joinDate || new Date().toISOString().split("T")[0],
      dob: dob || "",
      occupation: occupation || "",
      address: address || "",
      image: image || "",
      status: "active",
      bankDetails: {
        method: "",
        accountNumber: "",
        bankName: "",
        routingNumber: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newMember);

    return NextResponse.json(
      {
        member: { ...newMember, _id: result.insertedId },
        message: "Member created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
