"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";
import { formatCurrency } from "@/lib/utils/format";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function CandlestickChart({
  data,
  height = 360,
  vsCurrency = "usd",
}: {
  data: Candle[];
  height?: number;
  vsCurrency?: string;
}) {
  const [width, setWidth] = React.useState(800);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { gain: gainColor, loss: lossColor } = useGainLossColors();

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(w);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (data.length === 0) {
    return <Box ref={containerRef} sx={{ height }} />;
  }

  const margin = { top: 10, right: 8, bottom: 24, left: 64 };
  const plotWidth = Math.max(0, width - margin.left - margin.right);
  const plotHeight = Math.max(0, height - margin.top - margin.bottom);

  const high = Math.max(...data.map((d) => d.high));
  const low = Math.min(...data.map((d) => d.low));
  const range = high - low || 1;
  const padding = range * 0.05;
  const yMax = high + padding;
  const yMin = low - padding;

  const candleWidth = Math.max(1, (plotWidth / data.length) * 0.6);
  const step = plotWidth / data.length;

  const yFor = (value: number) => plotHeight - ((value - yMin) / (yMax - yMin)) * plotHeight;

  const yTicks = 5;
  const tickValues = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1));

  return (
    <Box ref={containerRef} sx={{ width: "100%", overflow: "hidden" }}>
      <svg width={width} height={height} role="img" aria-label="Candlestick price chart">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {tickValues.map((tick, i) => (
            <g key={i}>
              <line
                x1={0}
                x2={plotWidth}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke="currentColor"
                strokeOpacity={0.08}
              />
              <text x={-8} y={yFor(tick)} fontSize={10} textAnchor="end" dy="0.32em" fill="currentColor" opacity={0.6}>
                {formatCurrency(tick, vsCurrency)}
              </text>
            </g>
          ))}
          {data.map((candle, i) => {
            const x = i * step + step / 2;
            const isUp = candle.close >= candle.open;
            const color = isUp ? gainColor : lossColor;
            const bodyTop = yFor(Math.max(candle.open, candle.close));
            const bodyBottom = yFor(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(1, bodyBottom - bodyTop);
            return (
              <g key={candle.time}>
                <title>
                  {new Date(candle.time).toLocaleString()}: O {candle.open} H {candle.high} L{" "}
                  {candle.low} C {candle.close}
                </title>
                <line
                  x1={x}
                  x2={x}
                  y1={yFor(candle.high)}
                  y2={yFor(candle.low)}
                  stroke={color}
                  strokeWidth={1}
                />
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={color}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </Box>
  );
}
