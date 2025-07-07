import { type NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const { newPassword, currentPassword, email } = userData;

    if (!newPassword || !currentPassword) {
      return NextResponse.json(
        { error: "New password and current password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 409 });
    }

    // Compare current password using bcrypt
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      existingUser.password
    );
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 409 }
      );
    }

    // Check if new password is different from current password
    const isNewPasswordSame = await bcrypt.compare(
      newPassword,
      existingUser.password
    );
    if (isNewPasswordSame) {
      return NextResponse.json(
        { error: "New password cannot be the same as the current password" },
        { status: 409 }
      );
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const result = await db
      .collection("users")
      .updateOne(
        { email },
        { $set: { password: hashedNewPassword, updatedAt: new Date() } }
      );

    return NextResponse.json(
      {
        data: result,
        message: "Password changed successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
