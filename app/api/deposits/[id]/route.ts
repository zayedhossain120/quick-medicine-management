import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid deposit ID" },
        { status: 400 }
      );
    }
    const db = await getDatabase();
    // Find the deposit transaction
    const deposit = await db.collection("transactions").findOne({
      _id: new ObjectId(id),
      type: "deposit",
      status: "completed",
    });
    if (!deposit) {
      return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
    }
    // Delete the deposit transaction
    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });
    // Deduct the amount from the member's totalDeposits
    await db
      .collection("members")
      .updateOne(
        { _id: new ObjectId(deposit.memberId) },
        { $inc: { totalDeposits: -Math.abs(deposit.amount) } }
      );
    return NextResponse.json({ message: "Deposit deleted successfully" });
  } catch (error) {
    console.error("Delete deposit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
