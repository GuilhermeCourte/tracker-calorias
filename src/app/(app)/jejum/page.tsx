"use client";

import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Sparkles, Square, Timer } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endFast, getActiveFast, startFast } from "@/lib/firestore/fasts";
import {
  FAST_PRESET_MINUTES,
  FAST_TYPES,
  FAST_TYPE_LABEL,
  startFastSchema,
  type Fast,
  type StartFastFormValues,
} from "@/lib/schemas/fast";

type PageState =
  | { kind: "loading" }
  | { kind: "active"; fast: Fast }
  | { kind: "idle" }
  | { kind: "error"; message: string };

export default function JejumPage() {
  const { user } = useAuth();
  const [state, setState] = useState<PageState>({ kind: "loading" });

  const reload = useCallback(async () => {
    if (!user) return;
    setState({ kind: "loading" });
    try {
      const active = await getActiveFast();
      setState(active ? { kind: "active", fast: active } : { kind: "idle" });
    } catch (err) {
      console.error(err);
      setState({ kind: "error", message: "Não foi possível carregar o jejum." });
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Acompanhe seus ciclos de jejum</p>
        <h1 className="text-3xl font-bold tracking-tight">Jejum</h1>
      </header>

      {state.kind === "loading" && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {state.kind === "error" && (
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-destructive">{state.message}</p>
            <Button variant="outline" size="sm" onClick={reload} className="rounded-full">
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}
      {state.kind === "active" && <ActiveFastCard fast={state.fast} onChanged={reload} />}
      {state.kind === "idle" && <StartFastCard onStarted={reload} />}
    </div>
  );
}

function formatElapsed(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function ActiveFastCard({ fast, onChanged }: { fast: Fast; onChanged: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const elapsedMs = now - fast.startAt.getTime();
  const elapsedMin = Math.floor(elapsedMs / 60000);
  const percent = Math.min(100, Math.round((elapsedMin / fast.plannedDurationMinutes) * 100));
  const formatted = formatElapsed(elapsedMs);
  const reached = elapsedMin >= fast.plannedDurationMinutes;

  async function handleEnd() {
    setBusy(true);
    try {
      await endFast(fast.id, fast.startAt);
      toast.success("Jejum encerrado");
      setConfirmOpen(false);
      onChanged();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível encerrar.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
                <Timer className="size-4" />
              </span>
              <CardTitle>Jejum em andamento</CardTitle>
            </div>
            {reached && (
              <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-foreground">
                Meta atingida
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-mono text-5xl font-bold tabular-nums tracking-tight sm:text-6xl">
              {formatted}
            </p>
            <p className="text-sm text-muted-foreground">
              {FAST_TYPE_LABEL[fast.plannedType]} ·{" "}
              {Math.floor(fast.plannedDurationMinutes / 60)}h planejadas
            </p>
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
          <p className="text-xs text-muted-foreground">{percent}% do planejado</p>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(true)}
              className="rounded-full"
            >
              <Square className="size-4" /> Encerrar jejum
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!open) setConfirmOpen(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encerrar jejum?</DialogTitle>
            <DialogDescription>
              O jejum será registrado com a duração atual ({formatted}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={busy}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button onClick={handleEnd} disabled={busy} className="rounded-full">
              {busy ? "Encerrando…" : "Encerrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StartFastCard({ onStarted }: { onStarted: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StartFastFormValues>({
    resolver: zodResolver(startFastSchema),
    defaultValues: { plannedType: "16:8", customHours: "" },
  });

  const plannedType = watch("plannedType");
  const isCustom = plannedType === "custom";

  async function onSubmit(values: StartFastFormValues) {
    const minutes =
      values.plannedType === "custom"
        ? Math.round(Number(values.customHours) * 60)
        : FAST_PRESET_MINUTES[values.plannedType];
    try {
      await startFast({ plannedType: values.plannedType, plannedDurationMinutes: minutes });
      toast.success("Jejum iniciado");
      onStarted();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Não foi possível iniciar.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
            <Sparkles className="size-4" />
          </span>
          <CardTitle>Iniciar um jejum</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="plannedType">Tipo planejado</Label>
            <Controller
              control={control}
              name="plannedType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="plannedType" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAST_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {FAST_TYPE_LABEL[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.plannedType && (
              <p role="alert" className="text-xs text-destructive">
                {errors.plannedType.message}
              </p>
            )}
          </div>

          {isCustom && (
            <div className="space-y-2">
              <Label htmlFor="customHours">Duração (horas)</Label>
              <Input
                id="customHours"
                type="number"
                inputMode="numeric"
                min={1}
                max={72}
                placeholder="Ex.: 14"
                {...register("customHours")}
              />
              {errors.customHours && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.customHours.message}
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Apenas um jejum ativo por vez. Jejuns prolongados podem não ser indicados pra todos —
            consulte profissional de saúde antes de adotar ciclos longos.
          </p>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting} className="rounded-full">
              <Play className="size-4" />
              {isSubmitting ? "Iniciando…" : "Iniciar agora"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
