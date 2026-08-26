// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const { companies } = require("./seed-data/companies.js");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Bangladeshi IT companies to XAMPP MySQL database...");

  let seededCount = 0;
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
    seededCount++;
  }

  console.log(`✅ Successfully seeded ${seededCount} IT companies into local MySQL database!`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
