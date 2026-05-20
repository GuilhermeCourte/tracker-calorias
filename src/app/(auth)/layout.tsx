"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-6 pt-8 sm:px-10">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 ring-1 ring-border transition-colors hover:bg-secondary">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand">
            <Sprout className="size-3.5 text-brand-foreground" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Calorias &amp; Jejum</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
