// app/api/jobs/create/route.ts
// Job creation endpoint — saves jobs directly to MySQL database via Prisma

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const {
      jobTitle,
      jobDescription,
      salaryRangeMin,
      salaryRangeMax,
      techStack,
      applicationUrl,
      contactEmail,
      status = "PUBLISHED",
      companyId,
    } = body;

    // Strict validation: Title, Description, and Salary range are mandatory
    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title and description are required." },
        { status: 400 }
      );
    }

    const min = Number(salaryRangeMin);
    const max = Number(salaryRangeMax);

    if (!min || !max || min <= 0 || max <= 0 || max < min) {
      return NextResponse.json(
        { error: "Please enter a valid BDT salary range (Min and Max)." },
        { status: 400 }
      );
    }

    // Resolve company ID from logged-in user or requested ID
    let numericCompanyId = companyId ? parseInt(String(companyId), 10) : NaN;

    if (isNaN(numericCompanyId) && session?.user?.email) {
      const user = await prisma.user.findFirst({
        where: { personalEmail: session.user.email },
        include: { claimedCompany: true },
      });
      if (user?.claimedCompany) {
        numericCompanyId = user.claimedCompany.id;
      }
    }

    // If still not resolved, fallback to Brain Station 23 or first company
    if (isNaN(numericCompanyId)) {
      const brainStation = await prisma.company.findFirst({
        where: { companyName: { contains: "Brain Station" } },
      });
      numericCompanyId = brainStation ? brainStation.id : 1;
    }

    const newJob = await prisma.job.create({
      data: {
        companyId: numericCompanyId,
        jobTitle: String(jobTitle).trim(),
        jobDescription: String(jobDescription).trim(),
        salaryRangeMin: min,
        salaryRangeMax: max,
        applicationUrl: applicationUrl ? String(applicationUrl).trim() : null,
        contactEmail: contactEmail ? String(contactEmail).trim() : null,
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
      },
    });

    console.log(`[JOB CREATED] ID: ${newJob.id}, Company: ${numericCompanyId}, Title: ${jobTitle}`);

    return NextResponse.json(
      { success: true, message: "Job listing created successfully!", jobId: newJob.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[jobs/create] Error:", error);
    return NextResponse.json(
      { error: "Failed to create job in database." },
      { status: 500 }
    );
  }
}
