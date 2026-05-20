"use client";

import { BarChart3, Target, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

const PLACEHOLDERS = [
  {
    icon: Target,
    title: "Meta diária",
    description: "Defina sua meta calórica e acompanhe o consumo do dia.",
    hint: "Em breve · Etapa 6",
  },
  {
    icon: Timer,
    title: "Jejum atual",
    description: "Inicie, monitore e encerre seus ciclos de jejum.",
    hint: "Em breve · Etapa 7",
  },
  {
    icon: BarChart3,
    title: "Esta semana",
    description: "Gráficos de calorias e jejum nos últimos 7 dias.",
    hint: "Em breve · Etapa 9",
  },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Olá{user?.email ? `, ${user.email}` : ""}</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLACEHOLDERS.map(({ icon: Icon, title, description, hint }) => (
          <Card key={title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {hint}
                </span>
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-24 rounded-lg border border-dashed border-border bg-secondary/40" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
