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

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyToken(request.headers.get("authorization"));
    const userId = decoded.userId;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const userData = await request.json();
    const { newPassword, currentPassword } = userData;

    if (!newPassword || !currentPassword) {
      return NextResponse.json(
        { error: "New password and current password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if user exists and is admin
    const existingUser = await db.collection("users").findOne({
      _id: new ObjectId(userId),
      role: "admin",
    });

    if (!existingUser) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    if (existingUser.password !== currentPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 409 }
      );
    }

    if (existingUser.password === newPassword) {
      return NextResponse.json(
        { error: "New password cannot be the same as the current password" },
        { status: 409 }
      );
    }

    const result = await db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password: newPassword, updatedAt: new Date() } }
      );

    return NextResponse.json(
      {
        data: result,
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin change password error:", error);
    if (error.message === "Unauthorized" || error.message === "Invalid token") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
