"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEAL_TYPES,
  MEAL_TYPE_LABEL,
  mealFormSchema,
  type MealFormValues,
} from "@/lib/schemas/meal";

type Props = {
  initial: MealFormValues;
  submitLabel: string;
  onSubmit: (values: MealFormValues) => Promise<void>;
  onCancel?: () => void;
};

export function MealForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MealFormValues>({
    resolver: zodResolver(mealFormSchema),
    defaultValues: initial,
  });

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="space-y-4"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="datetime">Data e hora</Label>
          <Input id="datetime" type="datetime-local" className="w-full" {...register("datetime")} />
          {errors.datetime && (
            <p role="alert" className="text-xs text-destructive">
              {errors.datetime.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mealType">Tipo</Label>
          <Controller
            control={control}
            name="mealType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="mealType" className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {MEAL_TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mealType && (
            <p role="alert" className="text-xs text-destructive">
              {errors.mealType.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex.: 1 maçã e iogurte natural"
          {...register("description")}
        />
        {errors.description && (
          <p role="alert" className="text-xs text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="calories">Calorias (kcal)</Label>
        <Input
          id="calories"
          type="number"
          min={0}
          inputMode="numeric"
          {...register("calories", { valueAsNumber: true })}
        />
        {errors.calories && (
          <p role="alert" className="text-xs text-destructive">
            {errors.calories.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-full"
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="rounded-full">
          {isSubmitting ? "Salvando..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
