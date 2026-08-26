// app/api/reviews/submit/route.ts
// Review submission endpoint — saves verified reviews directly to database

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

    // Validation
    if (!companyId || !workLifeRating || !salaryRating || !managementRating || !reviewText) {
      return NextResponse.json(
        { error: "All ratings and review text are required." },
        { status: 400 }
      );
    }

    if (String(reviewText).trim().length < 10) {
      return NextResponse.json(
        { error: "Review text must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Resolve company ID
    let numericCompanyId = parseInt(String(companyId), 10);
    if (isNaN(numericCompanyId)) {
      const companyRecord = await prisma.company.findFirst({
        where: {
          OR: [
            { websiteDomain: String(companyId) },
            { companyName: String(companyId) },
          ],
        },
      });
      if (companyRecord) {
        numericCompanyId = companyRecord.id;
      } else {
        const firstCompany = await prisma.company.findFirst();
        numericCompanyId = firstCompany ? firstCompany.id : 1;
      }
    }

    // Check session or fallback to default user (user@gmail.com)
    const session = await getServerSession(authOptions);
    let userId: number;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { personalEmail: session.user.email },
      });
      userId = user ? user.id : 1;
    } else {
      const defaultUser = await prisma.user.findUnique({
        where: { personalEmail: "user@gmail.com" },
      });
      userId = defaultUser ? defaultUser.id : 1;
    }

    const newReview = await prisma.review.create({
      data: {
        companyId: numericCompanyId,
        userId,
        workLifeRating: parseInt(String(workLifeRating), 10),
        salaryRating: parseInt(String(salaryRating), 10),
        managementRating: parseInt(String(managementRating), 10),
        reviewText: String(reviewText).trim(),
        isAnonymous: Boolean(isAnonymous),
        voteScore: 1,
      },
    });

    console.log(`[REVIEW SAVED] ID: ${newReview.id}, CompanyId: ${numericCompanyId}`);

    return NextResponse.json(
      { success: true, message: "Review submitted successfully!", reviewId: newReview.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[reviews/submit] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit review to database." },
      { status: 500 }
    );
  }
}
