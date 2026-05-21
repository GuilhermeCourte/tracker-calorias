"use client";

import { Flame, Hourglass, Trophy, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDurationMinutes } from "@/lib/date";

type Props = {
  avgDailyKcal: number;
  totalFastsThisWeek: number;
  avgFastMinutes: number;
};

export function Kpis({ avgDailyKcal, totalFastsThisWeek, avgFastMinutes }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard
        icon={Flame}
        label="Média diária"
        value={`${avgDailyKcal}`}
        unit="kcal por dia"
      />
      <KpiCard
        icon={Trophy}
        label="Jejuns na semana"
        value={`${totalFastsThisWeek}`}
        unit={totalFastsThisWeek === 1 ? "concluído" : "concluídos"}
      />
      <KpiCard
        icon={Hourglass}
        label="Tempo médio"
        value={avgFastMinutes > 0 ? formatDurationMinutes(avgFastMinutes) : "—"}
        unit={avgFastMinutes > 0 ? "por jejum" : "sem dados"}
      />
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{unit}</p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
          <Icon className="size-4" />
        </span>
      </CardContent>
    </Card>
  );
}
