// prisma/seed.ts
// Seeds Bangladeshi IT companies, default users (user & admin), reviews, upvotes, and jobs

import { PrismaClient, UserRole, JobStatus, VoteType } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { companies } from "./seed-data/companies";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "mysql://root:@localhost:3306/techtribe";
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Password hash for password1234
  const passwordHash = await bcrypt.hash("password1234", 10);

  // 2. Default User: user@gmail.com
  const defaultUser = await prisma.user.upsert({
    where: { personalEmail: "user@gmail.com" },
    update: {
      fullName: "General User",
      passwordHash,
      role: UserRole.USER,
    },
    create: {
      fullName: "General User",
      personalEmail: "user@gmail.com",
      passwordHash,
      role: UserRole.USER,
    },
  });
  console.log(`👤 User created/verified: ${defaultUser.personalEmail} (Role: ${defaultUser.role})`);

  // 3. Default Admin: admin / admin@gmail.com
  const defaultAdmin = await prisma.user.upsert({
    where: { personalEmail: "admin@gmail.com" },
    update: {
      fullName: "Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      fullName: "Admin",
      personalEmail: "admin@gmail.com",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`🛡️ Admin created/verified: ${defaultAdmin.personalEmail} (Role: ${defaultAdmin.role})`);

  // Also support "admin" identifier if user login uses personalEmail
  const adminShort = await prisma.user.upsert({
    where: { personalEmail: "admin" },
    update: {
      fullName: "Super Admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
    create: {
      fullName: "Super Admin",
      personalEmail: "admin",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`🛡️ Short Admin created/verified: ${adminShort.personalEmail} (Role: ${adminShort.role})`);

  // Reviewer user for upvoting
  const reviewerUser = await prisma.user.upsert({
    where: { personalEmail: "reviewer@gmail.com" },
    update: {
      fullName: "Tanvir Hasan",
      passwordHash,
      role: UserRole.USER,
    },
    create: {
      fullName: "Tanvir Hasan",
      personalEmail: "reviewer@gmail.com",
      passwordHash,
      role: UserRole.USER,
    },
  });

  // 4. Seed Companies
  console.log("🏢 Seeding companies...");
  let seededCompaniesCount = 0;
  for (const company of companies) {
    await prisma.company.upsert({
      where: { websiteDomain: company.websiteDomain },
      update: {
        companyName: company.companyName,
        contactEmail: company.contactEmail || null,
        location: company.location,
        address: company.address || null,
        techStack: company.techStack,
        city: company.city || "Chattogram",
        facebookUrl: company.facebookUrl || null,
        linkedinUrl: company.linkedinUrl || null,
        isVerified: true,
      },
      create: {
        companyName: company.companyName,
        websiteDomain: company.websiteDomain,
        contactEmail: company.contactEmail || null,
        location: company.location,
        address: company.address || null,
        techStack: company.techStack,
        city: company.city || "Chattogram",
        facebookUrl: company.facebookUrl || null,
        linkedinUrl: company.linkedinUrl || null,
        isVerified: true,
      },
    });
    seededCompaniesCount++;
  }
  console.log(`✅ Seeded ${seededCompaniesCount} companies.`);

  // 5. Fetch sample companies for reviews and jobs
  const echoLogyx = await prisma.company.findUnique({ where: { websiteDomain: "echologyx.com" } });
  const blendin = await prisma.company.findUnique({ where: { websiteDomain: "blendin247.com" } });
  const xponent = await prisma.company.findUnique({ where: { websiteDomain: "xponent.com.bd" } });
  const softrobotics = await prisma.company.findUnique({ where: { websiteDomain: "softrobotics.com.bd" } });

  // 6. Seed Reviews
  console.log("⭐ Seeding reviews...");
  const reviewsToSeed = [];

  if (echoLogyx) {
    reviewsToSeed.push({
      userId: defaultUser.id,
      companyId: echoLogyx.id,
      workLifeRating: 5,
      salaryRating: 4,
      managementRating: 5,
      reviewText: "EchoLogyx offers an authentic remote-first environment with genuine respect for developer autonomy and work-life balance. Highly collaborative team!",
      isAnonymous: true,
      voteScore: 12,
    });
    reviewsToSeed.push({
      userId: reviewerUser.id,
      companyId: echoLogyx.id,
      workLifeRating: 4,
      salaryRating: 5,
      managementRating: 4,
      reviewText: "Salary scale is competitive and performance appraisals are timely. Very good learning curve on modern tech stacks.",
      isAnonymous: false,
      voteScore: 8,
    });
  }

  if (blendin) {
    reviewsToSeed.push({
      userId: defaultUser.id,
      companyId: blendin.id,
      workLifeRating: 4,
      salaryRating: 4,
      managementRating: 4,
      reviewText: "Blendin has a great agency culture with diverse international client projects. Team leads are approachable.",
      isAnonymous: true,
      voteScore: 5,
    });
  }

  if (xponent) {
    reviewsToSeed.push({
      userId: reviewerUser.id,
      companyId: xponent.id,
      workLifeRating: 4,
      salaryRating: 3,
      managementRating: 4,
      reviewText: "Solid base for software engineering fundamentals. Work culture is friendly and supportive for juniors.",
      isAnonymous: true,
      voteScore: 3,
    });
  }

  if (softrobotics) {
    reviewsToSeed.push({
      userId: defaultUser.id,
      companyId: softrobotics.id,
      workLifeRating: 5,
      salaryRating: 4,
      managementRating: 5,
      reviewText: "Unique workspace doing IoT and robotics development in Bangladesh. Exciting projects and visionary leadership.",
      isAnonymous: false,
      voteScore: 9,
    });
  }

  const seededReviews = [];
  for (const rev of reviewsToSeed) {
    const existing = await prisma.review.findFirst({
      where: {
        userId: rev.userId,
        companyId: rev.companyId,
        reviewText: rev.reviewText,
      },
    });

    if (!existing) {
      const created = await prisma.review.create({ data: rev });
      seededReviews.push(created);
    } else {
      seededReviews.push(existing);
    }
  }
  console.log(`✅ Seeded/verified ${seededReviews.length} reviews.`);

  // 7. Seed Upvotes / ReviewVotes
  console.log("👍 Seeding review votes...");
  let voteCount = 0;
  for (const review of seededReviews) {
    const votingUserId = review.userId === defaultUser.id ? reviewerUser.id : defaultUser.id;
    await prisma.reviewVote.upsert({
      where: {
        userId_reviewId: {
          userId: votingUserId,
          reviewId: review.id,
        },
      },
      update: {
        voteType: VoteType.UPVOTE,
      },
      create: {
        userId: votingUserId,
        reviewId: review.id,
        voteType: VoteType.UPVOTE,
      },
    });
    voteCount++;

    await prisma.reviewVote.upsert({
      where: {
        userId_reviewId: {
          userId: defaultAdmin.id,
          reviewId: review.id,
        },
      },
      update: {
        voteType: VoteType.UPVOTE,
      },
      create: {
        userId: defaultAdmin.id,
        reviewId: review.id,
        voteType: VoteType.UPVOTE,
      },
    });
    voteCount++;
  }
  console.log(`✅ Seeded ${voteCount} review upvotes.`);

  // 8. Seed Jobs
  console.log("💼 Seeding jobs...");
  const jobsToSeed = [];

  if (echoLogyx) {
    jobsToSeed.push({
      companyId: echoLogyx.id,
      jobTitle: "Senior Full Stack Engineer (React/Node/Go)",
      jobDescription: "We are seeking an experienced Full Stack Engineer to build scalable microservices and rich frontend dashboards.",
      salaryRangeMin: 90000,
      salaryRangeMax: 160000,
      status: JobStatus.PUBLISHED,
    });
    jobsToSeed.push({
      companyId: echoLogyx.id,
      jobTitle: "Junior Frontend Developer (React/Next.js)",
      jobDescription: "Join our remote frontend team building modern web applications with clean design systems.",
      salaryRangeMin: 35000,
      salaryRangeMax: 60000,
      status: JobStatus.PUBLISHED,
    });
  }

  if (blendin) {
    jobsToSeed.push({
      companyId: blendin.id,
      jobTitle: "WordPress & PHP Developer",
      jobDescription: "Expert in custom plugin development, theme customizer, and REST API integration.",
      salaryRangeMin: 45000,
      salaryRangeMax: 75000,
      status: JobStatus.PUBLISHED,
    });
  }

  if (softrobotics) {
    jobsToSeed.push({
      companyId: softrobotics.id,
      jobTitle: "Python / Robotics Software Engineer",
      jobDescription: "Work on ROS, embedded systems, and machine vision algorithms for automated robotics solutions.",
      salaryRangeMin: 65000,
      salaryRangeMax: 110000,
      status: JobStatus.PUBLISHED,
    });
  }

  let seededJobsCount = 0;
  for (const job of jobsToSeed) {
    const existing = await prisma.job.findFirst({
      where: {
        companyId: job.companyId,
        jobTitle: job.jobTitle,
      },
    });

    if (!existing) {
      await prisma.job.create({ data: job });
      seededJobsCount++;
    }
  }
  console.log(`✅ Seeded ${seededJobsCount} jobs.`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log("-----------------------------------------");
  console.log("Default User:  user@gmail.com  / password1234");
  console.log("Default Admin: admin@gmail.com (or username: admin) / password1234");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
