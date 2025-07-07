import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get the withdrawal request
    const withdrawalRequest = await db.collection("withdrawal_requests").findOne({ _id: new ObjectId(id) })

    if (!withdrawalRequest) {
      return NextResponse.json({ error: "Withdrawal request not found" }, { status: 404 })
    }

    if (withdrawalRequest.status !== "pending") {
      return NextResponse.json({ error: "Request has already been processed" }, { status: 400 })
    }

    // Create transaction
    const newTransaction = {
      memberId: withdrawalRequest.memberId,
      memberName: withdrawalRequest.memberName,
      memberImage: withdrawalRequest.memberImage,
      type: "withdrawal",
      amount: withdrawalRequest.amount,
      date: new Date().toISOString().split("T")[0],
      method: withdrawalRequest.method,
      status: "completed",
      note: withdrawalRequest.note,
      createdBy: withdrawalRequest.memberId, // In real app, this would be the admin's ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert transaction and update request status
    await Promise.all([
      db.collection("transactions").insertOne(newTransaction),
      db.collection("withdrawal_requests").updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            status: "approved",
            updatedAt: new Date(),
          },
        },
      ),
    ])

    return NextResponse.json({
      message: "Withdrawal request approved successfully",
    })
  } catch (error) {
    console.error("Approve withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
