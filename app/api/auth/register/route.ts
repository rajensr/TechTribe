// app/api/auth/register/route.ts
// User registration endpoint — hashed password store kore
// Real DB wire-up korar somoy Prisma query uncomment korte hobe

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma"; // DB ready hobar age comment

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, personalEmail, password } = body;

    // Basic validation — shob field present kina check
    if (!fullName || !personalEmail || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    // Password length check
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    // Email format check
    if (!personalEmail.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Password hashing — bcrypt 12 rounds
    const passwordHash = await bcrypt.hash(password, 12);

    // ─── DB QUERY (uncomment when MySQL ready) ────────────────────────────────
    // const existingUser = await prisma.user.findUnique({ where: { personalEmail } });
    // if (existingUser) {
    //   return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    // }
    // const user = await prisma.user.create({
    //   data: { fullName, personalEmail, passwordHash },
    // });
    // return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
    // ─────────────────────────────────────────────────────────────────────────

    // TEMPORARY: mock success response — DB er age
    console.log(`[MOCK] New user registered: ${personalEmail}, hash: ${passwordHash.slice(0, 10)}...`);
    return NextResponse.json({ success: true, userId: 999 }, { status: 201 });

  } catch (error) {
    console.error("[register] Error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
