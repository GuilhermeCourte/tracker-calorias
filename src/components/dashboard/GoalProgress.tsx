"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  consumed: number;
  goal: number | null;
};

export function GoalProgress({ consumed, goal }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
              <Target className="size-4" />
            </span>
            <CardTitle>Meta diária</CardTitle>
          </div>
          {goal !== null && (
            <Link
              href="/meta"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Editar
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {goal === null ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Você ainda não definiu uma meta — defina pra acompanhar o consumo do dia.
            </p>
            <Link
              href="/meta"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full",
              )}
            >
              Definir meta
            </Link>
          </div>
        ) : (
          <GoalBar consumed={consumed} goal={goal} />
        )}
      </CardContent>
    </Card>
  );
}

function GoalBar({ consumed, goal }: { consumed: number; goal: number }) {
  const percent = Math.max(0, Math.min(100, Math.round((consumed / goal) * 100)));
  const remaining = goal - consumed;

  let message: string;
  if (remaining > 0) message = `Restam ${remaining} kcal hoje`;
  else if (remaining === 0) message = "Meta do dia atingida";
  else message = `${Math.abs(remaining)} kcal acima da meta`;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-bold">
          {consumed}{" "}
          <span className="text-sm font-normal text-muted-foreground">/ {goal} kcal</span>
        </p>
        <p className="text-sm font-medium text-muted-foreground">{percent}%</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progresso da meta diária de calorias"
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}
