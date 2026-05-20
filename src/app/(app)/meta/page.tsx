"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Target } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDailyCalorieGoal, setDailyCalorieGoal } from "@/lib/firestore/user";
import { goalFormSchema, type GoalFormValues } from "@/lib/schemas/goal";

export default function MetaPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [current, setCurrent] = useState<number | null | "loading">("loading");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({ resolver: zodResolver(goalFormSchema) });

  useEffect(() => {
    if (!user) return;
    getDailyCalorieGoal()
      .then((val) => {
        setCurrent(val);
        if (val !== null) reset({ dailyCalorieGoal: val });
      })
      .catch((err) => {
        console.error(err);
        setCurrent(null);
      });
  }, [user, reset]);

  async function onSubmit(values: GoalFormValues) {
    try {
      await setDailyCalorieGoal(values.dailyCalorieGoal);
      toast.success("Meta atualizada");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar a meta.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Defina sua referência diária</p>
        <h1 className="text-3xl font-bold tracking-tight">Meta calórica</h1>
      </header>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft text-brand-foreground">
              <Target className="size-4" />
            </span>
            <CardTitle>Meta diária de calorias</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {current === "loading" && <p className="text-sm text-muted-foreground">Carregando…</p>}
          {current !== "loading" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="dailyCalorieGoal">Calorias por dia (kcal)</Label>
                <Input
                  id="dailyCalorieGoal"
                  type="number"
                  inputMode="numeric"
                  min={500}
                  max={10000}
                  placeholder="Ex.: 2000"
                  {...register("dailyCalorieGoal", { valueAsNumber: true })}
                />
                {errors.dailyCalorieGoal && (
                  <p role="alert" className="text-xs text-destructive">
                    {errors.dailyCalorieGoal.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Escolha um valor que se sinta sustentável pra você. Pode ajustar a qualquer
                  momento — esta é uma referência informativa, não uma prescrição.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </Link>
                <Button type="submit" disabled={isSubmitting} className="rounded-full">
                  {isSubmitting ? "Salvando…" : current === null ? "Definir meta" : "Atualizar"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
