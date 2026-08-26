"use client";
// components/auth/Providers.tsx
// Wraps application with NextAuth SessionProvider

import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
