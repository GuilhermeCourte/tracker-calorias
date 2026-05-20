import { z } from "zod";

export const MEAL_TYPES = ["cafe", "almoco", "lanche", "jantar", "ceia"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const MEAL_TYPE_LABEL: Record<MealType, string> = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  lanche: "Lanche",
  jantar: "Jantar",
  ceia: "Ceia",
};

export const mealFormSchema = z.object({
  datetime: z.string().min(1, "Informe data e hora"),
  description: z
    .string()
    .trim()
    .min(1, "Descrição obrigatória")
    .max(200, "Máximo 200 caracteres"),
  calories: z
    .number({ message: "Informe um número válido" })
    .int("Use número inteiro")
    .min(0, "Mínimo 0")
    .max(20000, "Máximo 20000"),
  mealType: z.enum(MEAL_TYPES, { message: "Selecione um tipo" }),
});

export type MealFormValues = z.infer<typeof mealFormSchema>;

export type Meal = {
  id: string;
  datetime: Date;
  description: string;
  calories: number;
  mealType: MealType;
};
