import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { getMarkets, getGlobal, getTrending } from "@/lib/api/coingecko";
import TrendingStrip from "@/components/coin/TrendingStrip";
import LiveTickerStrip from "@/components/coin/LiveTickerStrip";
import HomeMarketData from "./HomeMarketData";
import Link from "next/link";

export const revalidate = 60;

const FEATURES = [
  {
    icon: <BoltRoundedIcon color="primary" />,
    title: "Truly Live Prices",
    body: "Binance WebSocket streams tick prices in real time on top of CoinGecko's full market data — no polling delay.",
  },
  {
    icon: <PublicRoundedIcon color="primary" />,
    title: "Every Coin, Every Currency",
    body: "The full CoinGecko universe, priced in 36 world currencies, with a searchable A-Z directory of every tracked coin.",
  },
  {
    icon: <LockRoundedIcon color="primary" />,
    title: "Private by Design",
    body: "Your watchlist, portfolio and alerts live only in your browser's local storage — no account, no server-side tracking.",
  },
  {
    icon: <AccountBalanceWalletRoundedIcon color="primary" />,
    title: "Built for Real Use",
    body: "Portfolio P/L tracking, price alerts, a screener, DeFi/derivatives dashboards, and dozens of conversion tools.",
  },
];

export default async function HomePage() {
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
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "action.hover" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={2} sx={{ maxWidth: 720 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "3rem" } }}>
              Live crypto prices, real portfolio tracking.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
              Track thousands of coins with real-time Binance price streams, deep CoinGecko
              market data, and privacy-first portfolio tools — free, fast, no account needed.
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Link href="/markets">
                <Button variant="contained" size="large">
                  Explore Markets
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button variant="outlined" size="large">
                  Track Your Portfolio
                </Button>
              </Link>
            </Stack>
          </Stack>

          <Box sx={{ mt: 4 }}>
            <LiveTickerStrip coins={tickerCoins} />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <HomeMarketData initialCoins={coins} global={global} />

        {trendingRes && (
          <Box sx={{ mb: 3 }}>
            <TrendingStrip coins={trendingRes.coins} />
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 4 }}>
          {FEATURES.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Stack spacing={1}>
                  {feature.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.body}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
