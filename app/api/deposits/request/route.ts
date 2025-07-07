import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { memberId, amount, method, note } = requestData

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

    const newRequest = {
      memberId: new ObjectId(memberId),
      memberName: member.name,
      memberImage: member.image || "",
      amount: Number.parseFloat(amount),
      method,
      note: note || "",
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("deposit_requests").insertOne(newRequest)

    return NextResponse.json(
      {
        request: { ...newRequest, _id: result.insertedId },
        message: "Deposit request submitted successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create deposit request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
