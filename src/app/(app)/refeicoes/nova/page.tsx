"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { MealForm } from "@/components/meals/MealForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createMeal } from "@/lib/firestore/meals";
import { type MealFormValues } from "@/lib/schemas/meal";
import { formatDateTimeLocal } from "@/lib/date";

export default function NovaRefeicaoPage() {
  const router = useRouter();

  const initial: MealFormValues = {
    datetime: formatDateTimeLocal(new Date()),
    description: "",
    calories: 0,
    mealType: "almoco",
  };

  async function handleSubmit(values: MealFormValues) {
    try {
      await createMeal(values);
      toast.success("Refeição registrada");
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
          <CardTitle>Nova refeição</CardTitle>
        </CardHeader>
        <CardContent>
          <MealForm
            initial={initial}
            submitLabel="Salvar"
            onSubmit={handleSubmit}
            onCancel={() => router.push("/refeicoes")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
