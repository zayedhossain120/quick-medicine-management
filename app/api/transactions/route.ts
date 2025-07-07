import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    const status = searchParams.get("status") || "all"
    const memberId = searchParams.get("memberId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const db = await getDatabase()

    // Build query
    const query: any = {}

    if (search) {
      query.memberName = { $regex: search, $options: "i" }
    }

    if (type !== "all") {
      query.type = type
    }

    if (status !== "all") {
      query.status = status
    }

    if (memberId && ObjectId.isValid(memberId)) {
      query.memberId = new ObjectId(memberId)
    }

    // Get total count
    const total = await db.collection("transactions").countDocuments(query)

    // Get transactions with pagination
    const transactions = await db
      .collection("transactions")
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get transactions error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transactionData = await request.json()
    const { memberId, type, amount, method, note, date } = transactionData

    if (!memberId || !type || !amount || !method) {
      return NextResponse.json({ error: "Member ID, type, amount, and method are required" }, { status: 400 })
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

    const newTransaction = {
      memberId: new ObjectId(memberId),
      memberName: member.name,
      memberImage: member.image || "",
      type,
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
        message: "Transaction created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create transaction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
