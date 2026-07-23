import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { getMarkets, getGlobal, getTrending } from "@/lib/api/coingecko";
import TrendingStrip from "@/components/coin/TrendingStrip";
import LiveTickerStrip from "@/components/coin/LiveTickerStrip";
import HomeMarketData from "./HomeMarketData";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dashboard — Live Crypto Market Overview",
  description:
    "Your live crypto dashboard: global market stats, top gainers and losers, trending coins, and real-time prices across thousands of coins.",
  alternates: { canonical: "/dashboard" },
};

export default async function DashboardPage() {
  const [coins, globalRes, trendingRes] = await Promise.all([
    getMarkets({ perPage: 100, page: 1 }),
    getGlobal().catch(() => null),
    getTrending().catch(() => null),
  ]);

  const global = globalRes?.data ?? null;
  const tickerCoins = coins.slice(0, 12).map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: c.image,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Market Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live prices, global stats, and today's movers across thousands of coins.
        </Typography>
      </Stack>

      <Box sx={{ mb: 3 }}>
        <LiveTickerStrip coins={tickerCoins} />
      </Box>

      <HomeMarketData initialCoins={coins} global={global} />

      {trendingRes && (
        <Box sx={{ mb: 3 }}>
          <TrendingStrip coins={trendingRes.coins} />
        </Box>
      )}
    </Container>
  );
}
