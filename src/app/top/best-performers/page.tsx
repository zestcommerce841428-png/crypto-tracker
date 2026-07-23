import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getMarkets } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Best Performing Coins (7d) — Top 100 by Weekly Gain",
  description:
    "The top 100 cryptocurrencies by market cap, ranked by their 7-day price performance.",
  alternates: { canonical: "/top/best-performers" },
};

export default async function BestPerformersPage() {
  const coins = await getMarkets({ perPage: 100, page: 1 });
  const ranked = [...coins]
    .filter((c) => typeof c.price_change_percentage_7d_in_currency === "number")
    .sort(
      (a, b) =>
        (b.price_change_percentage_7d_in_currency ?? 0) -
        (a.price_change_percentage_7d_in_currency ?? 0)
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Best Performers (7 Days)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top 100 coins by market cap, ranked by 7-day price performance.
        </Typography>
      </Stack>
      <CoinMarketsTable coins={ranked} showRank={false} />
    </Container>
  );
}
