// app/api/jobs/create/route.ts
// Job creation endpoint — saves jobs directly to MySQL database via Prisma

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      jobTitle,
      jobDescription,
      salaryRangeMin,
      salaryRangeMax,
      techStack,
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

    // Resolve company ID
    let numericCompanyId = companyId ? parseInt(String(companyId), 10) : NaN;
    if (isNaN(numericCompanyId)) {
      const firstCompany = await prisma.company.findFirst();
      numericCompanyId = firstCompany ? firstCompany.id : 1;
    }

    const newJob = await prisma.job.create({
      data: {
        companyId: numericCompanyId,
        jobTitle: String(jobTitle).trim(),
        jobDescription: String(jobDescription).trim(),
        salaryRangeMin: min,
        salaryRangeMax: max,
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
      },
    });

    console.log(`[JOB CREATED] ID: ${newJob.id}, Title: ${jobTitle}, Range: ${min}-${max}`);

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
