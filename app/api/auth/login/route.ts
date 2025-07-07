// import { type NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();

//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const db = await getDatabase();
//     const user = await db.collection("users").findOne({ email });

//     if (!user) {
//       return NextResponse.json({ error: "User not found!" }, { status: 401 });
//     }

//     // ✅ Compare password using bcrypt
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // ✅ Ensure role is valid
//     if (!user.role || (user.role !== "admin" && user.role !== "member")) {
//       return NextResponse.json(
//         {
//           error: "Invalid user role. Please contact administrator.",
//         },
//         { status: 400 }
//       );
//     }

//     // ✅ Create JWT token
//     const token = jwt.sign(
//       {
//         userId: user._id,
//         email: user.email,
//         role: user.role,
//       },
//       process.env.JWT_SECRET!,
//       { expiresIn: "7d" }
//     );

//     // ✅ Remove password before sending response
//     const { password: _, ...userWithoutPassword } = user;

//     return NextResponse.json({
//       user: {
//         ...userWithoutPassword,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json({ ok: true });
}
