// app/api/reviews/submit/route.ts
// Review submission endpoint — IP address strip kore zero-tracking privacy guarantee korbe
// PRD Section 3 & 4: Anonymity and Zero-tracking Architecture

import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // DB ready hole uncomment korbo

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyId,
      workLifeRating,
      salaryRating,
      managementRating,
      reviewText,
      isAnonymous = true,
    } = body;

    // Validation — 3 ta rating r review text ache kina check
    if (!companyId || !workLifeRating || !salaryRating || !managementRating || !reviewText) {
      return NextResponse.json(
        { error: "Shob gulo rating ebong review text dewa baddhotamulok." },
        { status: 400 }
      );
    }

    if (reviewText.trim().length < 50) {
      return NextResponse.json(
        { error: "Review text ontoto 50 ta character hote hobe." },
        { status: 400 }
      );
    }

    // ─── ZERO TRACKING & PRIVACY NOTE ──────────────────────────────────────────
    // Server IP address request header theke bilkul read ba store korbe na.
    // ──────────────────────────────────────────────────────────────────────────

    // ─── DB QUERY (MySQL ready hole uncomment korbo) ──────────────────────────
    // const newReview = await prisma.review.create({
    //   data: {
    //     companyId: parseInt(companyId),
    //     userId: 1, // session theke logged-in user er id ashbe
    //     workLifeRating: parseInt(workLifeRating),
    //     salaryRating: parseInt(salaryRating),
    //     managementRating: parseInt(managementRating),
    //     reviewText,
    //     isAnonymous: Boolean(isAnonymous),
    //   },
    // });
    // return NextResponse.json({ success: true, reviewId: newReview.id }, { status: 201 });
    // ──────────────────────────────────────────────────────────────────────────

    console.log(`[MOCK REVIEW SUBMIT] CompanyId: ${companyId}, Anonymous: ${isAnonymous}`);
    return NextResponse.json(
      { success: true, message: "Review safollobhabe submit hoyeche!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[reviews/submit] Error:", error);
    return NextResponse.json(
      { error: "Review submit korte somossha hoyeche." },
      { status: 500 }
    );
  }
}
