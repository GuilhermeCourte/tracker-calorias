"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MealForm } from "@/components/meals/MealForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { getMeal, updateMeal } from "@/lib/firestore/meals";
import { type MealFormValues } from "@/lib/schemas/meal";
import { formatDateTimeLocal } from "@/lib/date";

type State =
  | { kind: "loading" }
  | { kind: "notfound" }
  | { kind: "loaded"; initial: MealFormValues };

export default function EditarRefeicaoPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!user || !id) return;
    getMeal(id)
      .then((m) => {
        if (!m) {
          setState({ kind: "notfound" });
          return;
        }
        setState({
          kind: "loaded",
          initial: {
            datetime: formatDateTimeLocal(m.datetime),
            description: m.description,
            calories: m.calories,
            mealType: m.mealType,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        setState({ kind: "notfound" });
      });
  }, [user, id]);

  async function handleSubmit(values: MealFormValues) {
    if (!id) return;
    try {
      await updateMeal(id, values);
      toast.success("Refeição atualizada");
      router.push("/refeicoes");
    } catch (err) {
      console.error(err);
      toast.error("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/refeicoes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Voltar
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Editar refeição</CardTitle>
        </CardHeader>
        <CardContent>
          {state.kind === "loading" && (
            <p className="text-sm text-muted-foreground">Carregando…</p>
          )}
          {state.kind === "notfound" && (
            <p className="text-sm text-destructive">Refeição não encontrada.</p>
          )}
          {state.kind === "loaded" && (
            <MealForm
              initial={state.initial}
              submitLabel="Atualizar"
              onSubmit={handleSubmit}
              onCancel={() => router.push("/refeicoes")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
