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
      return NextResponse.json({ error: "Invalid profit ID" }, { status: 400 });
    }
    const db = await getDatabase();
    // Find the profit transaction
    const profit = await db.collection("transactions").findOne({
      _id: new ObjectId(id),
      type: "profit",
    });
    if (!profit) {
      return NextResponse.json({ error: "Profit not found" }, { status: 404 });
    }
    // Delete the profit transaction
    await db.collection("transactions").deleteOne({ _id: new ObjectId(id) });

    // Deduct the amount from the member's totalProfits
    await db
      .collection("members")
      .updateOne(
        { _id: new ObjectId(profit.memberId) },
        { $inc: { totalProfits: -Math.abs(profit.amount) } }
      );
    return NextResponse.json({ message: "Profit deleted successfully" });
  } catch (error) {
    console.error("Delete profit error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
