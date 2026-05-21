"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  data: { label: string; kcal: number }[];
  goal: number | null;
};

export function WeeklyCaloriesChart({ data, goal }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorias por dia · últimos 7 dias</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                tick={{ fontSize: 12 }}
                width={40}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--accent)", opacity: 0.5 }}
                contentStyle={{
                  background: "var(--popover)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "var(--foreground)", fontWeight: 500 }}
                formatter={(value) => {
                  const n = typeof value === "number" ? value : 0;
                  return [`${n} kcal`, "Consumido"];
                }}
              />
              {goal !== null && (
                <ReferenceLine
                  y={goal}
                  stroke="var(--foreground)"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                  label={{
                    value: `Meta ${goal}`,
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                    position: "insideTopRight",
                  }}
                />
              )}
              <Bar dataKey="kcal" fill="var(--brand)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
