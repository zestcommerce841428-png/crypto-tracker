"use client";

import * as React from "react";
import useSWR from "swr";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import Stack from "@mui/material/Stack";
import { LineChart } from "@mui/x-charts/LineChart";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";
import { formatCurrency } from "@/lib/utils/format";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import CandlestickChart from "./CandlestickChart";

const RANGES: { label: string; days: number | "max" }[] = [
  { label: "24h", days: 1 },
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
  { label: "Max", days: "max" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function CoinPriceChart({
  coinId,
  vsCurrency: vsCurrencyOverride,
}: {
  coinId: string;
  /** Pin a specific currency regardless of the global selector — used by
   * pages like /convert/[from]/[to] that are about one fixed currency pair. */
  vsCurrency?: string;
}) {
  const storeCurrency = useSettingsStore((s) => s.vsCurrency);
  const vsCurrency = vsCurrencyOverride ?? storeCurrency;
  const { gain: gainColor, loss: lossColor } = useGainLossColors();
  const [days, setDays] = React.useState<number | "max">(7);
  const [chartType, setChartType] = React.useState<"line" | "candlestick">("line");

  const { data, isLoading } = useSWR<{ prices: [number, number][] }>(
    chartType === "line"
      ? `/api/coin/${coinId}/chart?vs_currency=${vsCurrency}&days=${days}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  // CoinGecko's OHLC endpoint only accepts a fixed set of day windows.
  const ohlcDays = days === "max" ? 365 : days === 1 ? 1 : days <= 7 ? 7 : days <= 30 ? 30 : days <= 90 ? 90 : 180;
  const { data: candles, isLoading: candlesLoading } = useSWR<Candle[]>(
    chartType === "candlestick"
      ? `/api/coin/${coinId}/ohlc?vs_currency=${vsCurrency}&days=${ohlcDays}`
      : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const prices = data?.prices ?? [];
  const values = prices.map((p) => p[1]);
  const times = prices.map((p) => p[0]);
  const isPositive = values.length > 1 ? values[values.length - 1] >= values[0] : true;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={chartType}
          onChange={(_e, value) => value !== null && setChartType(value)}
        >
          <ToggleButton value="line" sx={{ px: 1.5 }}>
            Line
          </ToggleButton>
          <ToggleButton value="candlestick" sx={{ px: 1.5 }}>
            Candlestick
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={days}
          onChange={(_e, value) => value !== null && setDays(value)}
        >
          {RANGES.map((r) => (
            <ToggleButton key={r.label} value={r.days} sx={{ px: 1.5 }}>
              {r.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      {chartType === "line" ? (
        isLoading || values.length < 2 ? (
          <Skeleton variant="rounded" height={360} />
        ) : (
          <LineChart
            series={[
              {
                data: values,
                area: true,
                showMark: false,
                color: isPositive ? gainColor : lossColor,
                valueFormatter: (v) => (v === null ? "" : formatCurrency(v, vsCurrency)),
              },
            ]}
            xAxis={[
              {
                data: times,
                scaleType: "time",
                valueFormatter: (t: number) =>
                  new Date(t).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    ...(days === 1 ? { hour: "2-digit" } : {}),
                  }),
              },
            ]}
            height={360}
            margin={{ top: 20, bottom: 30, left: 60, right: 20 }}
            grid={{ horizontal: true }}
            sx={{
              "& .MuiAreaElement-root": { fillOpacity: 0.12 },
              "& .MuiLineElement-root": { strokeWidth: 2 },
            }}
          />
        )
      ) : candlesLoading || !candles || candles.length < 2 ? (
        <Skeleton variant="rounded" height={360} />
      ) : (
        <CandlestickChart data={candles} height={360} vsCurrency={vsCurrency} />
      )}
    </Box>
  );
}
