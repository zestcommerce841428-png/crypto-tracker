"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";

export default function Sparkline({
  data,
  width = 140,
  height = 48,
}: {
  data: number[];
  width?: number;
  height?: number;
}) {
  const { gain, loss } = useGainLossColors();

  if (!data || data.length < 2) {
    return <div style={{ width, height }} />;
  }
  const isPositive = data[data.length - 1] >= data[0];

  return (
    <LineChart
      series={[
        {
          data,
          showMark: false,
          color: isPositive ? gain : loss,
          area: false,
        },
      ]}
      xAxis={[{ data: data.map((_, i) => i), scaleType: "point", position: "none" }]}
      yAxis={[{ position: "none" }]}
      width={width}
      height={height}
      margin={{ top: 4, bottom: 4, left: 2, right: 2 }}
      disableAxisListener
      skipAnimation
      sx={{
        "& .MuiLineElement-root": { strokeWidth: 1.5 },
        pointerEvents: "none",
      }}
    />
  );
}
