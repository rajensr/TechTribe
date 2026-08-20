// app/api/auth/[...nextauth]/route.ts
// NextAuth v4 route handler — NextAuth(authOptions) diye GET ebong POST export kora hoy

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
