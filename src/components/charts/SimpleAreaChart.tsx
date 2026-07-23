"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";
import { ACCENT_COLORS } from "@/lib/store/useAccessibilityStore";

interface Point {
  time: number;
  value: number;
}

export default function SimpleAreaChart({
  data,
  height = 240,
  valueSuffix = "",
}: {
  data: Point[];
  height?: number;
  valueSuffix?: string;
}) {
  const accentColor = useAccessibilityStore((s) => s.accentColor);
  const color = ACCENT_COLORS.find((c) => c.id === accentColor)?.hex ?? "#3861fb";

  if (data.length < 2) return null;

  return (
    <LineChart
      series={[
        {
          data: data.map((d) => d.value),
          area: true,
          showMark: false,
          color,
          valueFormatter: (v) => (v === null ? "" : `${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}${valueSuffix}`),
        },
      ]}
      xAxis={[
        {
          data: data.map((d) => d.time),
          scaleType: "time",
          valueFormatter: (t: number) =>
            new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        },
      ]}
      height={height}
      margin={{ top: 16, bottom: 30, left: 60, right: 20 }}
      grid={{ horizontal: true }}
      sx={{
        "& .MuiAreaElement-root": { fillOpacity: 0.12 },
        "& .MuiLineElement-root": { strokeWidth: 2 },
      }}
    />
  );
}
