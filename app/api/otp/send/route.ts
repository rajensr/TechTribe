// app/api/otp/send/route.ts
// OTP send endpoint — corporate email domain validate kore, OTP pathay
// PRD Section 4: corporate email domain != personal email domain

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
// import { Resend } from "resend"; // Email ready hobar age comment
// import prisma from "@/lib/prisma"; // DB ready hobar age comment

// Corporate email domain whitelist — company domain verify kora hobe
// Real hobe: DB theke company.websiteDomain match kore check
function isValidCorporateEmail(email: string, companyDomain?: string): boolean {
  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (!emailDomain) return false;

  // Personal email provider check — reject kora hobe
  const PERSONAL_PROVIDERS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "proton.me", "icloud.com"];
  if (PERSONAL_PROVIDERS.includes(emailDomain)) return false;

  // Company domain match — optional check
  if (companyDomain && !emailDomain.includes(companyDomain.replace("www.", ""))) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { corporateEmail, companyId } = body;

    // Validation
    if (!corporateEmail) {
      return NextResponse.json({ error: "Corporate email is required." }, { status: 400 });
    }

    // Personal email reject kora — PRD privacy requirement
    if (!isValidCorporateEmail(corporateEmail)) {
      return NextResponse.json(
        { error: "Please use your corporate email address, not a personal one (Gmail, Yahoo, etc.)." },
        { status: 400 }
      );
    }

    // 6-digit OTP generate — cryptographically secure
    const otpPlain = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otpPlain, 10);

    // Corporate email hash — never store plain email
    const emailHash = crypto
      .createHash("sha256")
      .update(corporateEmail.toLowerCase())
      .digest("hex");

    // Expiry — 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // ─── DB STORE (uncomment when MySQL ready) ────────────────────────────────
    // // Delete existing OTP for this email hash (only 1 active at a time)
    // await prisma.otpToken.deleteMany({ where: { corporateEmailHash: emailHash } });
    // await prisma.otpToken.create({
    //   data: { corporateEmailHash: emailHash, companyId: parseInt(companyId), otpHash, expiresAt },
    // });
    // ─────────────────────────────────────────────────────────────────────────

    // ─── RESEND EMAIL (uncomment when RESEND_API_KEY is set) ─────────────────
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: process.env.RESEND_FROM_EMAIL!,
    //   to: corporateEmail,
    //   subject: "TechTribe — Your Verification Code",
    //   html: `<p>Your TechTribe OTP code is: <strong>${otpPlain}</strong></p><p>Expires in 10 minutes.</p>`,
    // });
    // ─────────────────────────────────────────────────────────────────────────

    // TEMPORARY: OTP console e log koro — dev er jonno
    console.log(`[MOCK OTP] Email: ${corporateEmail} | OTP: ${otpPlain}`);

    return NextResponse.json({ success: true, message: "OTP sent to your corporate email." });

  } catch (error) {
    console.error("[otp/send] Error:", error);
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
