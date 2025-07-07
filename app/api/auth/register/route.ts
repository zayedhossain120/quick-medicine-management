import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { name, email, password, role = "member" } = userData;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with simple password (no hashing)
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      phone: userData.phone || "",
      joinDate: new Date().toISOString().split("T")[0],
      dob: userData.dob || "",
      occupation: userData.occupation || "",
      address: userData.address || "",
      image: userData.image || "",
      status: "active",
      bankDetails: userData.bankDetails || {
        method: "",
        accountName: "",
        accountNumber: "",
        bankName: "",
        branch: "",
        routingNumber: "",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        user: { ...userWithoutPassword, _id: result.insertedId },
        message: "User created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
