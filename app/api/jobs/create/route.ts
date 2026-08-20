// app/api/jobs/create/route.ts
// Job creation endpoint — mandatory salary enforcement (PRD Section 5.4)

import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma"; // DB ready hole uncomment korbo

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
      companyId = 1, // session theke claimed company id ashbe
    } = body;

    // Strict validation: Title, Description, ebong Salary range mandatory
    if (!jobTitle || !jobDescription) {
      return NextResponse.json(
        { error: "Job title ebong description dewa baddhotamulok." },
        { status: 400 }
      );
    }

    const min = Number(salaryRangeMin);
    const max = Number(salaryRangeMax);

    if (!min || !max || min <= 0 || max <= 0 || max < min) {
      return NextResponse.json(
        { error: "Thikthak BDT salary range (Min ebong Max) dewa baddhotamulok." },
        { status: 400 }
      );
    }

    // ─── DB QUERY (MySQL ready hole uncomment korbo) ──────────────────────────
    // const newJob = await prisma.job.create({
    //   data: {
    //     companyId: parseInt(companyId),
    //     jobTitle,
    //     jobDescription,
    //     salaryRangeMin: min,
    //     salaryRangeMax: max,
    //     status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
    //   },
    // });
    // return NextResponse.json({ success: true, jobId: newJob.id }, { status: 201 });
    // ──────────────────────────────────────────────────────────────────────────

    console.log(`[MOCK JOB CREATE] Title: ${jobTitle}, Range: ${min}-${max}`);
    return NextResponse.json(
      { success: true, message: "Job listing safollobhabe toiri hoyeche!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[jobs/create] Error:", error);
    return NextResponse.json(
      { error: "Job create korte somossha hoyeche." },
      { status: 500 }
    );
  }
}
