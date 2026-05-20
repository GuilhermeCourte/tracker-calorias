import { z } from "zod";

export const FAST_TYPES = ["16:8", "18:6", "20:4", "24h", "custom"] as const;
export type FastType = (typeof FAST_TYPES)[number];

export const FAST_TYPE_LABEL: Record<FastType, string> = {
  "16:8": "16:8 — 16h em jejum",
  "18:6": "18:6 — 18h em jejum",
  "20:4": "20:4 — 20h em jejum",
  "24h": "24h em jejum",
  custom: "Personalizado",
};

export const FAST_PRESET_MINUTES: Record<Exclude<FastType, "custom">, number> = {
  "16:8": 16 * 60,
  "18:6": 18 * 60,
  "20:4": 20 * 60,
  "24h": 24 * 60,
};

export const startFastSchema = z
  .object({
    plannedType: z.enum(FAST_TYPES),
    customHours: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.plannedType !== "custom") return;
    const raw = data.customHours?.trim();
    if (!raw) {
      ctx.addIssue({
        code: "custom",
        path: ["customHours"],
        message: "Informe a duração em horas",
      });
      return;
    }
    const n = Number(raw);
    if (!Number.isInteger(n) || n < 1 || n > 72) {
      ctx.addIssue({
        code: "custom",
        path: ["customHours"],
        message: "Entre 1 e 72 horas inteiras",
      });
    }
  });

export type StartFastFormValues = z.infer<typeof startFastSchema>;

export type Fast = {
  id: string;
  startAt: Date;
  endAt: Date | null;
  plannedType: FastType;
  plannedDurationMinutes: number;
  durationMinutes: number | null;
};
