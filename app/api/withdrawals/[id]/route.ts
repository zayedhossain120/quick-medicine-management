import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid withdrawal ID" },
        { status: 400 }
      );
    }
    const db = await getDatabase();

    // Find the withdrawal transaction
    const withdrawal = await db.collection("transactions").findOne({
      _id: new ObjectId(id),
      type: "withdrawal",
      status: "completed",
    });

    if (!withdrawal) {
      return NextResponse.json(
        { error: "Withdrawal not found" },
        { status: 404 }
      );
    }

    // Delete the withdrawal transaction
    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
    // Deduct the amount from the member's totalWithdrawals
    await db
      .collection("members")
      .updateOne(
        { _id: new ObjectId(withdrawal.memberId) },
        { $inc: { totalWithdrawals: -Math.abs(withdrawal.amount) } }
      );
    return NextResponse.json({ message: "Withdrawal deleted successfully" });
  } catch (error) {
    console.error("Delete withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
