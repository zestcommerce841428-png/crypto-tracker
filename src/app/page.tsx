import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Link from "next/link";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import AccessibilityNewRoundedIcon from "@mui/icons-material/AccessibilityNewRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { getMarkets, getGlobal } from "@/lib/api/coingecko";
import { formatCompactNumber } from "@/lib/utils/format";
import LiveTickerStrip from "@/components/coin/LiveTickerStrip";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const FEATURES = [
  {
    icon: <BoltRoundedIcon color="primary" fontSize="large" />,
    title: "Truly Live Prices",
    body: "Binance WebSocket streams tick prices, order books and trades in real time — no polling delay, ever.",
  },
  {
    icon: <PublicRoundedIcon color="primary" fontSize="large" />,
    title: "Every Coin, Every Currency",
    body: "The full CoinGecko universe, priced in 36 world currencies, with a searchable A-Z directory of every tracked coin.",
  },
  {
    icon: <CandlestickChartRoundedIcon color="primary" fontSize="large" />,
    title: "Real Trading Tools",
    body: "Candlestick charts, live order books, a screener, portfolio P/L tracking, and dozens of conversion tools.",
  },
  {
    icon: <NotificationsActiveRoundedIcon color="primary" fontSize="large" />,
    title: "Custom Price Alerts",
    body: "Set a target price on any coin and get a browser notification the moment it's hit.",
  },
  {
    icon: <AccessibilityNewRoundedIcon color="primary" fontSize="large" />,
    title: "Genuinely Accessible",
    body: "56 real theme combinations, colorblind-safe gain/loss colors, dyslexia-friendly fonts, and text-to-speech.",
  },
  {
    icon: <LockRoundedIcon color="primary" fontSize="large" />,
    title: "Private by Design",
    body: "Your watchlist, portfolio and alerts live only in your browser's local storage — no account, no tracking.",
  },
];

const STEPS = [
  { n: "1", title: "Browse or search", body: "Explore thousands of coins, or search any name or ticker instantly." },
  { n: "2", title: "Track what matters", body: "Star coins to your watchlist, or log real holdings in your portfolio." },
  { n: "3", title: "Stay ahead", body: "Set price alerts, watch live order books, and share what you find." },
];

export default async function LandingPage() {
  const [coins, globalRes] = await Promise.all([
    getMarkets({ perPage: 12, page: 1 }),
    getGlobal().catch(() => null),
  ]);
  const global = globalRes?.data ?? null;

  const tickerCoins = coins.map((c) => ({
    id: c.id,
    symbol: c.symbol,
    name: c.name,
    image: c.image,
    price: c.current_price,
    change24h: c.price_change_percentage_24h,
  }));

  const stats = [
    { label: "Coins Tracked", value: "16,000+" },
    { label: "World Currencies", value: "36" },
    { label: "Market Cap Tracked", value: formatCompactNumber(global?.total_market_cap?.usd, "usd") },
    { label: "Always", value: "Free" },
  ];

  return (
    <Box>
      {/* Hero */}
      <Box className="hero-gradient" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
          <Chip label="Live on Binance + CoinGecko data" color="primary" variant="outlined" sx={{ mb: 3 }} />
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" }, mb: 2 }}
          >
            Crypto prices, live.
            <br />
            Your portfolio, private.
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 400, maxWidth: 640, mx: "auto", mb: 4 }}
          >
            Real-time prices, deep market data, and portfolio tracking for thousands of
            cryptocurrencies — free, fast, and without an account.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 5 }}>
            <Link href="/dashboard">
              <Button variant="contained" size="large" sx={{ px: 4 }}>
                Open Dashboard
              </Button>
            </Link>
            <Link href="/markets">
              <Button variant="outlined" size="large" sx={{ px: 4 }}>
                Explore Markets
              </Button>
            </Link>
          </Stack>

          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            <LiveTickerStrip coins={tickerCoins} />
          </Box>
        </Container>
      </Box>

      {/* Stats bar */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={2}>
          {stats.map((s) => (
            <Grid size={{ xs: 6, md: 3 }} key={s.label}>
              <Paper variant="outlined" sx={{ p: 2.5, textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={0.5} sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Everything you need, nothing you don&apos;t
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Built for people who actually watch the market, not just check it once a day.
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {FEATURES.map((feature) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.title}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Stack spacing={1.5}>
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

      {/* How it works */}
      <Box sx={{ bgcolor: "action.hover", borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: "center", mb: 4 }}>
            How it works
          </Typography>
          <Grid container spacing={4}>
            {STEPS.map((step) => (
              <Grid size={{ xs: 12, md: 4 }} key={step.n}>
                <Stack spacing={1.5} alignItems={{ xs: "center", md: "flex-start" }} textAlign={{ xs: "center", md: "left" }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 18,
                    }}
                  >
                    {step.n}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.body}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <AccountBalanceWalletRoundedIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
          Start tracking in seconds
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          No sign-up, no email, no credit card. Just open the dashboard and go.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Link href="/dashboard">
            <Button variant="contained" size="large" sx={{ px: 4 }}>
              Open Dashboard
            </Button>
          </Link>
          <Link href="/portfolio">
            <Button variant="outlined" size="large" sx={{ px: 4 }}>
              Track Your Portfolio
            </Button>
          </Link>
        </Stack>
      </Container>
    </Box>
  );
}
