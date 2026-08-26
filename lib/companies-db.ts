// lib/companies-db.ts
// Database helper function — fetches live companies & reviews from XAMPP MySQL database via Prisma
import prisma from "@/lib/prisma";
import { MOCK_COMPANIES, MOCK_JOBS } from "@/lib/mock-data";

export async function getCompaniesFromDb(query?: { q?: string; city?: string; stack?: string; sort?: string }) {
  try {
    const where: any = {};
    if (query?.city && query.city !== "All") {
      where.city = query.city;
    }
    if (query?.q) {
      where.OR = [
        { companyName: { contains: query.q } },
        { techStack: { contains: query.q } },
        { location: { contains: query.q } },
      ];
    }
    if (query?.stack) {
      where.techStack = { contains: query.stack };
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        reviews: true,
      },
      orderBy: query?.sort === "work_life" ? { id: "asc" } : { id: "desc" },
    });

    if (companies.length > 0) {
      return companies.map((c) => {
        const reviewCount = c.reviews.length;
        const avgWorkLife = reviewCount > 0 ? c.reviews.reduce((acc, r) => acc + r.workLifeRating, 0) / reviewCount : 4.5;
        const avgSalary = reviewCount > 0 ? c.reviews.reduce((acc, r) => acc + r.salaryRating, 0) / reviewCount : 4.3;
        const avgMgmt = reviewCount > 0 ? c.reviews.reduce((acc, r) => acc + r.managementRating, 0) / reviewCount : 4.5;
        const overallRating = Math.round(((avgWorkLife + avgSalary + avgMgmt) / 3) * 10) / 10;

        return {
          id: c.id,
          companyName: c.companyName,
          websiteDomain: c.websiteDomain,
          location: c.location,
          city: c.city,
          techStack: c.techStack,
          overallRating,
          workLifeRating: Math.round(avgWorkLife * 10) / 10,
          salaryRating: Math.round(avgSalary * 10) / 10,
          managementRating: Math.round(avgMgmt * 10) / 10,
          reviewCount: reviewCount || 1,
          isVerified: c.isVerified,
          isClaimed: c.isClaimed,
          employeeCount: "11-50",
          trustBadge: "Verified IT Firm",
          logoUrl: c.logoUrl,
        };
      });
    }
  } catch (error) {
    console.error("MySQL DB query error, falling back to mock data:", error);
  }

  // Fallback to MOCK_COMPANIES if DB table is empty or connecting
  let filtered = [...MOCK_COMPANIES];
  if (query?.city && query.city !== "All") {
    filtered = filtered.filter((c) => c.city === query.city);
  }
  if (query?.q) {
    const qLower = query.q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.companyName.toLowerCase().includes(qLower) ||
        c.techStack.toLowerCase().includes(qLower) ||
        c.location.toLowerCase().includes(qLower)
    );
  }
  if (query?.stack) {
    filtered = filtered.filter((c) => c.techStack.includes(query.stack!));
  }
  return filtered;
}
