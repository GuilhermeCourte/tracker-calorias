"use client";

import { useEffect, useState } from "react";
import { BarChart3, Target, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { FastStatus } from "@/components/dashboard/FastStatus";
import { listMealsByDate } from "@/lib/firestore/meals";
import { getDailyCalorieGoal } from "@/lib/firestore/user";
import { getActiveFast } from "@/lib/firestore/fasts";
import { type Fast } from "@/lib/schemas/fast";

const PLACEHOLDERS = [
  {
    icon: BarChart3,
    title: "Esta semana",
    description: "Gráficos de calorias e jejum nos últimos 7 dias.",
    hint: "Em breve · Etapa 9",
  },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();
  const [goal, setGoal] = useState<number | null | "loading">("loading");
  const [consumed, setConsumed] = useState<number | "loading">("loading");
  const [activeFast, setActiveFast] = useState<Fast | null | "loading">("loading");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    Promise.all([
      getDailyCalorieGoal(),
      listMealsByDate(new Date()).then((meals) =>
        meals.reduce((sum, m) => sum + m.calories, 0),
      ),
      getActiveFast(),
    ])
      .then(([g, c, f]) => {
        if (cancelled) return;
        setGoal(g);
        setConsumed(c);
        setActiveFast(f);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setGoal(null);
        setConsumed(0);
        setActiveFast(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const goalReady = goal !== "loading" && consumed !== "loading";
  const fastReady = activeFast !== "loading";

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Olá{user?.email ? `, ${user.email}` : ""}</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {goalReady ? (
          <GoalProgress consumed={consumed} goal={goal} />
        ) : (
          <SkeletonCard icon={Target} title="Meta diária" />
        )}

        {fastReady ? (
          <FastStatus fast={activeFast} />
        ) : (
          <SkeletonCard icon={Timer} title="Jejum" />
        )}

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

function SkeletonCard({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
            <Icon className="size-4" />
          </span>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Carregando…</p>
      </CardContent>
    </Card>
  );
}
