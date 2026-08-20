// lib/auth.ts
// NextAuth v4 configuration — credentials provider (email + password)
// Session strategy: JWT (database session e Prisma adapter lagbe, pore wire korbo)

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma"; // DB ready hobar age comment rakho

export const authOptions: NextAuthOptions = {
  // JWT session — stateless, no DB dependency for auth
  session: {
    strategy: "jwt",
  },

  // Custom sign in page — default NextAuth page na
  pages: {
    signIn: "/auth/signin",
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      // Authorize function — DB query kore user check korbe
      // Database tayyor hobar age mock user diye test korte pari
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        // ─── MOCK AUTH (DB tayyor hoar age) ─────────────────────────────────
        // Real DB wire-up korar somoy niche er code diye replace korte hobe:
        //
        // const user = await prisma.user.findUnique({ where: { personalEmail: email } });
        // if (!user) return null;
        // const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        // if (!passwordMatch) return null;
        // return { id: String(user.id), name: user.fullName, email: user.personalEmail, role: user.role };
        //
        // ──────────────────────────────────────────────────────────────────────

        // TEMPORARY MOCK: admin@techtribe.xyz / admin123 diye login korte paro test er jonno
        if (email === "admin@techtribe.xyz") {
          const mockHash = await bcrypt.hash("admin123", 10);
          const isAdmin = await bcrypt.compare(password, mockHash);
          if (!isAdmin && password !== "admin123") return null;
          return {
            id: "1",
            name: "TechTribe Admin",
            email: "admin@techtribe.xyz",
            role: "ADMIN",
          };
        }

        // Regular user mock — any non-admin email
        if (password.length >= 8) {
          return {
            id: "2",
            name: email.split("@")[0],
            email,
            role: "USER",
          };
        }

        return null;
      },
    }),
  ],

  // JWT callbacks — token e role inject kora
  callbacks: {
    // JWT token e role save kora
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
        token.id = user.id;
      }
      return token;
    },

    // Session e role expose kora — client side accessible hobe
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production-techtribe",
};
