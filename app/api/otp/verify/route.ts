// app/api/otp/verify/route.ts
// OTP verification — 6-digit code DB er hash er shathe compare kora hobe
// Ekhane OTP check kora hocche — invalid hole error throw korbe

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma"; // DB ready hobar age comment

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { otp, companyId } = body;

    // Basic validation
    if (!otp || otp.length !== 6) {
      return NextResponse.json({ error: "Please enter the 6-digit verification code." }, { status: 400 });
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: "OTP must be 6 digits only." }, { status: 400 });
    }

    // ─── DB VERIFY (uncomment when MySQL ready) ───────────────────────────────
    // // Corporate email hash theke OTP fetch
    // const token = await prisma.otpToken.findFirst({
    //   where: {
    //     companyId: parseInt(companyId),
    //     expiresAt: { gte: new Date() }, // expire hoyni
    //   },
    //   orderBy: { createdAt: "desc" },
    // });
    //
    // if (!token) {
    //   return NextResponse.json({ error: "OTP expired or not found. Please request a new one." }, { status: 400 });
    // }
    //
    // // OTP hash comparison — bcrypt compare
    // const isValid = await bcrypt.compare(otp, token.otpHash);
    //
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid OTP. Please try again." }, { status: 400 });
    // }
    //
    // // Single use — use korar pore delete
    // await prisma.otpToken.delete({ where: { id: token.id } });
    // ─────────────────────────────────────────────────────────────────────────

    // TEMPORARY: mock verification — any 6-digit code accept korbe
    console.log(`[MOCK OTP VERIFY] OTP: ${otp}, Company: ${companyId}`);
    // Mock: 000000 ba kono 6-digit e pass hobe — dev testing er jonno
    // Real: bcrypt.compare(otp, token.otpHash)

    return NextResponse.json({ success: true, message: "OTP verified. You can now submit your review." });

  } catch (error) {
    console.error("[otp/verify] Error:", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}
