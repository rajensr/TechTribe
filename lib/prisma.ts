// lib/prisma.ts
// Prisma Client singleton — development e hot reload e multiple instance create hooa theke bachao
// Backend wire-up korar somoy shob API route e ekhane import korte hobe

import { PrismaClient } from "@prisma/client";

// Global type declaration — dev mode e global object e store kora hoy
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Development e global e cache kora — production e fresh instance
const prisma = global.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

// Production e global e store kora theke bachano — memory leak prevent
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
