import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getMarkets } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Top Gainers & Losers — Biggest 24h Crypto Movers",
  description:
    "Discover the cryptocurrencies with the biggest price gains and losses in the last 24 hours, ranked among the top 250 coins by market cap.",
  alternates: { canonical: "/gainers-losers" },
};

export default async function GainersLosersPage() {
  const coins = await getMarkets({ perPage: 250, page: 1, sparkline: false });
  const eligible = coins.filter((c) => typeof c.price_change_percentage_24h === "number");
  const gainers = [...eligible].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
  ).slice(0, 15);
  const losers = [...eligible].sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
  ).slice(0, 15);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Top Gainers & Losers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Biggest 24-hour price movers among the top 250 coins by market cap.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} color="success.main">
            Top Gainers
          </Typography>
          <CoinMarketsTable coins={gainers} showSparkline={false} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }} color="error.main">
            Top Losers
          </Typography>
          <CoinMarketsTable coins={losers} showSparkline={false} />
        </Grid>
      </Grid>
    </Container>
  );
}
