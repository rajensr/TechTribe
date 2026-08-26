// prisma.config.ts
import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node ./prisma/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
