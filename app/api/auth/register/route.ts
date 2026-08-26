import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, personalEmail, password } = body;

    // Basic validation
    if (!fullName || !personalEmail || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailTrimmed = personalEmail.trim().toLowerCase();
    if (!emailTrimmed.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findFirst({
      where: { personalEmail: emailTrimmed },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email address is already registered. Please sign in." },
        { status: 409 }
      );
    }

    // Password hashing — bcrypt 12 rounds
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        personalEmail: emailTrimmed,
        passwordHash,
        role: "USER",
      },
    });

    console.log(`[USER REGISTERED] ID: ${newUser.id}, Email: ${newUser.personalEmail}`);

    return NextResponse.json(
      { success: true, message: "Account created successfully!", userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register] Error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
