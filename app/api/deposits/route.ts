import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    // Get completed deposits
    const deposits = await db
      .collection("transactions")
      .find({ type: "deposit", status: "completed" })
      .sort({ createdAt: -1 })
      .toArray()

    // Get pending deposit requests
    const pendingRequests = await db
      .collection("deposit_requests")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      deposits,
      pendingRequests,
    })
  } catch (error) {
    console.error("Get deposits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const depositData = await request.json()
    const { memberId, amount, method, note, date } = depositData

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

    // Create transaction directly (admin adding deposit)
    const newTransaction = {
      memberId: new ObjectId(memberId),
      memberName: member.name,
      memberImage: member.image || "",
      type: "deposit",
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
        message: "Deposit added successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
