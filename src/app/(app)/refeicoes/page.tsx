"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { deleteMeal, listMealsByDate } from "@/lib/firestore/meals";
import { MEAL_TYPE_LABEL, type Meal } from "@/lib/schemas/meal";
import { formatTime, formatYMD, parseYMD } from "@/lib/date";

export default function RefeicoesPage() {
  const { user } = useAuth();
  const [date, setDate] = useState(() => formatYMD(new Date()));
  const [meals, setMeals] = useState<Meal[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Meal | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!user) return;
    setMeals(null);
    setError(null);
    try {
      const list = await listMealsByDate(parseYMD(date));
      setMeals(list);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar as refeições.");
    }
  }, [user, date]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function confirmDelete() {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteMeal(deleting.id);
      toast.success("Refeição excluída");
      setDeleting(null);
      await reload();
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível excluir.");
    } finally {
      setBusy(false);
    }
  }

  const total = meals?.reduce((sum, m) => sum + m.calories, 0) ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Registre o que você comeu</p>
          <h1 className="text-3xl font-bold tracking-tight">Refeições</h1>
        </div>
        <Link
          href="/refeicoes/nova"
          className={cn(buttonVariants({ variant: "default" }), "rounded-full")}
        >
          <Plus className="size-4" />
          Nova refeição
        </Link>
      </header>

      <Card>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <Label htmlFor="filter-date">Filtrar por data</Label>
            <Input
              id="filter-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-44"
            />
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total do dia</p>
            <p className="text-2xl font-bold">
              {total}{" "}
              <span className="text-sm font-normal text-muted-foreground">kcal</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={reload}
              className="rounded-full"
            >
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      )}

      {meals === null && !error && (
        <p className="text-sm text-muted-foreground">Carregando…</p>
      )}

      {meals && meals.length === 0 && !error && (
        <Card>
          <CardContent className="space-y-3 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma refeição registrada para esta data.
            </p>
            <Link
              href="/refeicoes/nova"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "rounded-full",
              )}
            >
              <Plus className="size-4" />
              Adicionar primeira refeição
            </Link>
          </CardContent>
        </Card>
      )}

      {meals && meals.length > 0 && (
        <ul className="space-y-2">
          {meals.map((meal) => (
            <li key={meal.id}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-foreground">
                        {MEAL_TYPE_LABEL[meal.mealType]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(meal.datetime)}
                      </span>
                    </div>
                    <p className="truncate font-medium">{meal.description}</p>
                    <p className="text-sm text-muted-foreground">{meal.calories} kcal</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/refeicoes/${meal.id}/editar`}
                      aria-label={`Editar ${meal.description}`}
                      className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Excluir ${meal.description}`}
                      onClick={() => setDeleting(meal)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir refeição?</DialogTitle>
            <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
            {deleting && (
              <p className="text-sm text-muted-foreground">
                A refeição &quot;{deleting.description}&quot; ({deleting.calories} kcal) será
                removida.
              </p>
            )}
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleting(null)}
              disabled={busy}
              className="rounded-full"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={busy}
              className="rounded-full"
            >
              {busy ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
