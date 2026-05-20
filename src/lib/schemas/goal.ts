import { z } from "zod";

export const goalFormSchema = z.object({
  dailyCalorieGoal: z
    .number({ message: "Informe um número válido" })
    .int("Use número inteiro")
    .min(500, "Mínimo 500 kcal")
    .max(10000, "Máximo 10000 kcal"),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
