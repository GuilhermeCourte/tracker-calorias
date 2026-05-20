"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FAST_TYPE_LABEL, type Fast } from "@/lib/schemas/fast";

type Props = {
  fast: Fast | null;
};

export function FastStatus({ fast }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
              <Timer className="size-4" />
            </span>
            <CardTitle>Jejum</CardTitle>
          </div>
          {fast && (
            <Link
              href="/jejum"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Ver
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {fast === null ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Nenhum jejum ativo no momento.</p>
            <Link
              href="/jejum"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full",
              )}
            >
              <Sparkles className="size-4" />
              Iniciar um jejum
            </Link>
          </div>
        ) : (
          <ActiveTimer fast={fast} />
        )}
      </CardContent>
    </Card>
  );
}

function ActiveTimer({ fast }: { fast: Fast }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = Math.max(0, now - fast.startAt.getTime());
  const totalSec = Math.floor(elapsedMs / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const elapsedMin = Math.floor(totalSec / 60);
  const percent = Math.min(100, Math.round((elapsedMin / fast.plannedDurationMinutes) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-2xl font-bold tabular-nums">{formatted}</p>
        <p className="text-sm font-medium text-muted-foreground">{percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso do jejum planejado"
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{FAST_TYPE_LABEL[fast.plannedType]}</p>
    </div>
  );
}
