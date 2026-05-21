"use client";

import { useCallback, useEffect, useState } from "react";
import { Target, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { GoalProgress } from "@/components/dashboard/GoalProgress";
import { FastStatus } from "@/components/dashboard/FastStatus";
import { Kpis } from "@/components/dashboard/Kpis";
import { WeeklyCaloriesChart } from "@/components/dashboard/WeeklyCaloriesChart";
import { WeeklyFastChart } from "@/components/dashboard/WeeklyFastChart";
import { listMealsInRange } from "@/lib/firestore/meals";
import { getDailyCalorieGoal } from "@/lib/firestore/user";
import { getActiveFast, listCompletedFastsInRange } from "@/lib/firestore/fasts";
import { type Fast } from "@/lib/schemas/fast";
import { endOfDay, formatYMD, lastSevenDays, weekdayShort } from "@/lib/date";

type WeeklyDay = {
  date: string;
  label: string;
  kcal: number;
  fastHours: number;
};

type DashboardData = {
  goal: number | null;
  activeFast: Fast | null;
  consumedToday: number;
  weeklyData: WeeklyDay[];
  avgDailyKcal: number;
  totalFastsThisWeek: number;
  avgFastMinutes: number;
};

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; data: DashboardData };

export default function DashboardPage() {
  const { user } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  const reload = useCallback(async () => {
    if (!user) return;
    setState({ kind: "loading" });

    const days = lastSevenDays();
    const weekStart = days[0];
    const weekEnd = endOfDay(days[6]);
    const todayKey = formatYMD(days[6]);

    try {
      const [goal, activeFast, weekMeals, weekFasts] = await Promise.all([
        getDailyCalorieGoal(),
        getActiveFast(),
        listMealsInRange(weekStart, weekEnd),
        listCompletedFastsInRange(weekStart, weekEnd),
      ]);

      const weeklyData: WeeklyDay[] = days.map((day) => {
        const dayKey = formatYMD(day);
        const kcal = weekMeals
          .filter((m) => formatYMD(m.datetime) === dayKey)
          .reduce((sum, m) => sum + m.calories, 0);
        const fastMinutes = weekFasts
          .filter((f) => f.endAt && formatYMD(f.endAt) === dayKey)
          .reduce((sum, f) => sum + (f.durationMinutes ?? 0), 0);
        return {
          date: dayKey,
          label: weekdayShort(day),
          kcal,
          fastHours: Math.round((fastMinutes / 60) * 10) / 10,
        };
      });

      const consumedToday =
        weeklyData.find((d) => d.date === todayKey)?.kcal ?? 0;
      const totalWeekKcal = weeklyData.reduce((sum, d) => sum + d.kcal, 0);
      const avgDailyKcal = Math.round(totalWeekKcal / 7);
      const totalFastsThisWeek = weekFasts.length;
      const avgFastMinutes =
        totalFastsThisWeek > 0
          ? Math.round(
              weekFasts.reduce((sum, f) => sum + (f.durationMinutes ?? 0), 0) /
                totalFastsThisWeek,
            )
          : 0;

      setState({
        kind: "ready",
        data: {
          goal,
          activeFast,
          consumedToday,
          weeklyData,
          avgDailyKcal,
          totalFastsThisWeek,
          avgFastMinutes,
        },
      });
    } catch (err) {
      console.error(err);
      setState({ kind: "error" });
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Olá{user?.email ? `, ${user.email}` : ""}</p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </header>

      {state.kind === "loading" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SkeletonCard icon={Target} title="Meta diária" />
          <SkeletonCard icon={Timer} title="Jejum" />
        </div>
      )}

      {state.kind === "error" && (
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-destructive">
              Não foi possível carregar o dashboard.
            </p>
            <Button variant="outline" size="sm" onClick={reload} className="rounded-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {state.kind === "ready" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <GoalProgress consumed={state.data.consumedToday} goal={state.data.goal} />
            <FastStatus fast={state.data.activeFast} />
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight">Esta semana</h2>
            <Kpis
              avgDailyKcal={state.data.avgDailyKcal}
              totalFastsThisWeek={state.data.totalFastsThisWeek}
              avgFastMinutes={state.data.avgFastMinutes}
            />
            <WeeklyCaloriesChart data={state.data.weeklyData} goal={state.data.goal} />
            <WeeklyFastChart data={state.data.weeklyData} />
          </section>
        </>
      )}
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
