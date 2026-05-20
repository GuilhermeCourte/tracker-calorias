"use client";

import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FAST_TYPE_LABEL, type Fast } from "@/lib/schemas/fast";
import { formatDateTimeShort, formatDurationMinutes } from "@/lib/date";

type Props = {
  fasts: Fast[] | null;
  error: string | null;
  onRetry: () => void;
};

export function HistoryList({ fasts, error, onRetry }: Props) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
          <History className="size-4" />
        </span>
        <h2 className="text-xl font-bold tracking-tight">Histórico</h2>
      </div>

      {error && (
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={onRetry} className="rounded-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {fasts === null && !error && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}

      {fasts && fasts.length === 0 && !error && (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            Nenhum jejum concluído ainda — seus registros aparecerão aqui.
          </CardContent>
        </Card>
      )}

      {fasts && fasts.length > 0 && (
        <ul className="space-y-2">
          {fasts.map((fast) => {
            const duration = fast.durationMinutes ?? 0;
            const planned = fast.plannedDurationMinutes;
            const reached = duration >= planned;
            return (
              <li key={fast.id}>
                <Card>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-foreground">
                          {FAST_TYPE_LABEL[fast.plannedType]}
                        </span>
                        {reached && (
                          <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-foreground">
                            Meta atingida
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-semibold">{formatDurationMinutes(duration)}</p>
                      <p className="text-xs text-muted-foreground">
                        Começou {formatDateTimeShort(fast.startAt)}
                        {fast.endAt && <> · Encerrou {formatDateTimeShort(fast.endAt)}</>}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>Planejado</p>
                      <p className="font-medium text-foreground">
                        {formatDurationMinutes(planned)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
