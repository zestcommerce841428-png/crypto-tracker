"use client";

import * as React from "react";
import useSWR from "swr";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import StatCard from "@/components/common/StatCard";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import { formatCompactNumber, formatPercent, formatCurrency } from "@/lib/utils/format";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import type { CoinMarket } from "@/lib/types/coin";
import type { GlobalMarketData } from "@/lib/types/coin";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomeMarketData({
  initialCoins,
  global,
}: {
  initialCoins: CoinMarket[];
  global: GlobalMarketData | null;
}) {
  const vsCurrency = useSettingsStore((s) => s.vsCurrency);

  const { data, isLoading } = useSWR<CoinMarket[]>(
    `/api/markets?vs_currency=${vsCurrency}&per_page=100&page=1`,
    fetcher,
    {
      fallbackData: vsCurrency === "usd" ? initialCoins : undefined,
      refreshInterval: 45000,
      revalidateOnFocus: false,
    }
  );

  const coins = data ?? [];
  const eligible = coins.filter((c) => typeof c.price_change_percentage_24h === "number");
  const topGainers = [...eligible]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);
  const topLosers = [...eligible]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const marketCap = global?.total_market_cap?.[vsCurrency];
  const volume = global?.total_volume?.[vsCurrency];

  const MoverRow = ({ coin }: { coin: CoinMarket }) => (
    <Link href={`/coin/${coin.id}`} style={{ color: "inherit" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar src={coin.image} sx={{ width: 22, height: 22 }} />
          <Typography variant="body2">{coin.name}</Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="body2">{formatCurrency(coin.current_price, vsCurrency)}</Typography>
          <PriceChangeChip value={coin.price_change_percentage_24h} />
        </Stack>
      </Stack>
    </Link>
  );

  return (
    <>
      {global && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="Market Cap"
              value={formatCompactNumber(marketCap, vsCurrency)}
              sub={formatPercent(global.market_cap_change_percentage_24h_usd)}
              subColor={global.market_cap_change_percentage_24h_usd >= 0 ? "success.main" : "error.main"}
            />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="24h Volume" value={formatCompactNumber(volume, vsCurrency)} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="BTC Dominance" value={`${global.market_cap_percentage?.btc?.toFixed(1)}%`} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard
              label="Active Cryptocurrencies"
              value={global.active_cryptocurrencies?.toLocaleString()}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="success.main">
                Top Gainers (24h)
              </Typography>
              <Link href="/gainers-losers">
                <Button size="small">View all →</Button>
              </Link>
            </Stack>
            <Stack spacing={1}>
              {topGainers.map((coin) => (
                <MoverRow coin={coin} key={coin.id} />
              ))}
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }} color="error.main">
                Top Losers (24h)
              </Typography>
              <Link href="/gainers-losers">
                <Button size="small">View all →</Button>
              </Link>
            </Stack>
            <Stack spacing={1}>
              {topLosers.map((coin) => (
                <MoverRow coin={coin} key={coin.id} />
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Top Cryptocurrencies by Market Cap
        </Typography>
        <Link href="/markets">
          <Button size="small">View all markets →</Button>
        </Link>
      </Stack>
      <CoinMarketsTable coins={coins.slice(0, 20)} vsCurrency={vsCurrency} isLoading={isLoading && coins.length === 0} />
    </>
  );
}
