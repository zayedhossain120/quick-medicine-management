import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

// Helper function to verify JWT token
function verifyToken(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback-secret"
    ) as any;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

// Get admin profile
export async function GET(request: NextRequest) {
  try {
    const decoded = verifyToken(request.headers.get("authorization"));
    const userId = decoded.userId;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const db = await getDatabase();
    const user = await db
      .collection("users")
      .findOne(
        { _id: new ObjectId(userId), role: "admin" },
        { projection: { password: 0 } }
      );

    if (!user) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ profile: user });
  } catch (error: any) {
    console.error("Get profile error:", error);
    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const decoded = verifyToken(request.headers.get("authorization"));
    const userId = decoded.userId;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const updateData = await request.json();
    const { name, image, phone, address } = updateData;

    // Prevent email updates through this endpoint
    if (updateData.email) {
      return NextResponse.json(
        { error: "Email cannot be updated through this endpoint" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Verify user is admin
    const existingUser = await db.collection("users").findOne({
      _id: new ObjectId(userId),
      role: "admin",
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    // Prepare update data
    const safeUpdateData: any = {};
    if (name !== undefined) safeUpdateData.name = name;
    if (image !== undefined) safeUpdateData.image = image;
    if (phone !== undefined) safeUpdateData.phone = phone;
    if (address !== undefined) safeUpdateData.address = address;

    // Add updated timestamp
    safeUpdateData.updatedAt = new Date();

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: safeUpdateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
