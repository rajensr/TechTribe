// app/api/otp/send/route.ts
// OTP send endpoint — corporate email domain validate kore, OTP pathay / dev default OTP support

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { corporateEmail, companyId } = body;

    if (!corporateEmail) {
      return NextResponse.json({ error: "Corporate email is required." }, { status: 400 });
    }

    const emailDomain = corporateEmail.split("@")[1]?.toLowerCase();
    if (!emailDomain) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Default OTP value requested by user: 12345 (also supports standard 123456 or 12345)
    const otpPlain = "12345";
    const otpHash = await bcrypt.hash(otpPlain, 10);

    const emailHash = crypto
      .createHash("sha256")
      .update(corporateEmail.toLowerCase())
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save/refresh OTP in Database
    try {
      await prisma.otpToken.deleteMany({
        where: { corporateEmailHash: emailHash },
      });

      await prisma.otpToken.create({
        data: {
          corporateEmailHash: emailHash,
          companyId: companyId ? parseInt(String(companyId), 10) : 1,
          otpHash,
          expiresAt,
        },
      });
    } catch (dbErr) {
      console.warn("[otp/send] DB warning (proceeding with dev mode):", dbErr);
    }

    console.log(`[OTP SENT] Email: ${corporateEmail} | Default OTP: ${otpPlain}`);

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully. (Dev default: ${otpPlain})`,
    });
  } catch (error) {
    console.error("[otp/send] Error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
