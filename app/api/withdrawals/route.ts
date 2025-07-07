import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Get completed withdrawals
    const withdrawals = await db
      .collection("transactions")
      .find({ type: "withdrawal", status: "completed" })
      .sort({ createdAt: -1 })
      .toArray()

    // Get pending withdrawal requests
    const pendingRequests = await db
      .collection("withdrawal_requests")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      withdrawals,
      pendingRequests,
    })
  } catch (error) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const withdrawalData = await request.json()
    const { memberId, amount, method, note, date } = withdrawalData

    if (!memberId || !amount || !method) {
      return NextResponse.json({ error: "Member ID, amount, and method are required" }, { status: 400 })
    }

    if (!ObjectId.isValid(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get member details
    const member = await db
      .collection("users")
      .findOne({ _id: new ObjectId(memberId) }, { projection: { name: 1, image: 1 } })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Create transaction directly (admin adding withdrawal)
    const newTransaction = {
      memberId: new ObjectId(memberId),
      memberName: member.name,
      memberImage: member.image || "",
      type: "withdrawal",
      amount: Number.parseFloat(amount),
      date: date || new Date().toISOString().split("T")[0],
      method,
      status: "completed",
      note: note || "",
      createdBy: new ObjectId(memberId), // In real app, this would be the admin's ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("transactions").insertOne(newTransaction)

    return NextResponse.json(
      {
        transaction: { ...newTransaction, _id: result.insertedId },
        message: "Withdrawal added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
