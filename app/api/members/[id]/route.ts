import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const db = await getDatabase();

    const member = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get member's transactions
    const transactions = await db
      .collection("transactions")
      .find({ memberId: new ObjectId(id) })
      .sort({ createdAt: -1 })
      .toArray();

    // Calculate balances
    const completedTransactions = transactions.filter(
      (t) => t.status === "completed"
    );
    const deposits = completedTransactions
      .filter((t) => t.type === "deposit")
      .reduce((sum, t) => sum + t.amount, 0);

    const withdrawals = completedTransactions
      .filter((t) => t.type === "withdrawal")
      .reduce((sum, t) => sum + t.amount, 0);

    const profits = completedTransactions
      .filter((t) => t.type === "profit")
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = deposits + profits - withdrawals;

    return NextResponse.json({
      member: {
        ...member,
        balance,
        totalDeposits: deposits,
        totalWithdrawals: withdrawals,
        totalProfits: profits,
      },
      transactions,
    });
  } catch (error) {
    console.error("Get member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updateData = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const db = await getDatabase();

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { role, _id, createdAt, ...safeUpdateData } = updateData;

    // Hash password if it's being updated
    if (safeUpdateData.password) {
      const hashedPassword = await bcrypt.hash(safeUpdateData.password, 10);
      safeUpdateData.password = hashedPassword;
    }

    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...safeUpdateData,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Member updated successfully",
    });
  } catch (error) {
    console.error("Update member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 });
    }

    const db = await getDatabase();

    const result = await db.collection("users").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
