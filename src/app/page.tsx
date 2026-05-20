import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="px-6 pt-8 sm:px-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 ring-1 ring-border">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand">
            <Sprout className="size-3.5 text-brand-foreground" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Calorias &amp; Jejum</span>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-7 px-6 text-center sm:px-10">
        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-6xl">
          Acompanhe seu dia
          <span className="ml-2 inline-block rounded-full bg-brand px-4 py-1 text-brand-foreground sm:px-5">
            sem pressa
          </span>
          .
        </h1>

        <p className="max-w-prose text-balance text-base text-muted-foreground sm:text-lg">
          Registre refeições, defina uma meta calórica gentil e observe seus ciclos de jejum
          intermitente — tudo num só lugar, simples e privado.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/cadastro"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Criar conta
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Entrar
          </Link>
        </div>
      </main>

      <footer className="border-t border-border px-6 py-6 text-center text-xs text-muted-foreground sm:px-10">
        Este aplicativo é um exercício acadêmico e não substitui orientação médica ou
        nutricional. Use as informações como referência informativa, não como prescrição.
      </footer>
    </div>
  );
}
