"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Sprout } from "lucide-react";
import { auth } from "@/lib/firebase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/refeicoes", label: "Refeições" },
  { href: "/jejum", label: "Jejum" },
  { href: "/meta", label: "Meta" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand text-brand-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  async function handleLogout() {
    await signOut(auth);
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-full bg-brand">
              <Sprout className="size-4 text-brand-foreground" />
            </span>
            <span className="hidden font-semibold tracking-tight sm:inline">
              Calorias &amp; Jejum
            </span>
          </Link>

          <nav
            aria-label="Principal"
            className="hidden flex-1 items-center justify-center gap-1 md:flex"
          >
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground lg:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-full">
              Sair
            </Button>
          </div>
        </div>

        <nav
          aria-label="Principal (mobile)"
          className="border-t border-border md:hidden"
        >
          <div className="mx-auto flex w-full max-w-5xl items-center gap-1 overflow-x-auto px-6 py-2">
            {NAV.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </nav>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        {children}
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-6 py-6 text-center text-xs text-muted-foreground">
          Este aplicativo é um exercício acadêmico e não substitui orientação médica ou
          nutricional. Use as informações como referência informativa, não como prescrição.
        </div>
      </footer>
    </div>
  );
}
