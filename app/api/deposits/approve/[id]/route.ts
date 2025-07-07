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

    // Get the deposit request
    const depositRequest = await db.collection("deposit_requests").findOne({ _id: new ObjectId(id) })

    if (!depositRequest) {
      return NextResponse.json({ error: "Deposit request not found" }, { status: 404 })
    }

    if (depositRequest.status !== "pending") {
      return NextResponse.json({ error: "Request has already been processed" }, { status: 400 })
    }

    // Create transaction
    const newTransaction = {
      memberId: depositRequest.memberId,
      memberName: depositRequest.memberName,
      memberImage: depositRequest.memberImage,
      type: "deposit",
      amount: depositRequest.amount,
      date: new Date().toISOString().split("T")[0],
      method: depositRequest.method,
      status: "completed",
      note: depositRequest.note,
      createdBy: depositRequest.memberId, // In real app, this would be the admin's ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert transaction and update request status
    await Promise.all([
      db.collection("transactions").insertOne(newTransaction),
      db.collection("deposit_requests").updateOne(
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
      message: "Deposit request approved successfully",
    })
  } catch (error) {
    console.error("Approve deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
