import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid request ID" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Get the withdrawal request
    const withdrawalRequest = await db
      .collection("withdrawal_requests")
      .findOne({ _id: new ObjectId(id) });

    if (!withdrawalRequest) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    if (withdrawalRequest.status !== "pending") {
      return NextResponse.json(
        { error: "Request has already been processed" },
        { status: 400 }
      );
    }

    // Update request status to declined
    await db.collection("withdrawal_requests").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "declined",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      message: "Withdrawal request declined successfully",
    });
  } catch (error) {
    console.error("Decline withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
