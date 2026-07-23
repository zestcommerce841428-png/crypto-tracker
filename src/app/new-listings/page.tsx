import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { getMarkets } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "New & Small-Cap Listings — Recently Added Coins",
  description:
    "Explore smaller-cap and recently listed cryptocurrencies not yet in the top market cap rankings.",
  alternates: { canonical: "/new-listings" },
};

export default async function NewListingsPage() {
  const coins = await getMarkets({
    perPage: 50,
    page: 1,
    order: "market_cap_asc",
    sparkline: false,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          New & Small-Cap Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Smaller-cap coins tracked by CoinGecko — often includes recently listed projects.
        </Typography>
      </Stack>
      <Alert severity="info" sx={{ mb: 2 }}>
        CoinGecko&apos;s free API doesn&apos;t expose an official &quot;listing date&quot; feed, so
        this view is sorted by ascending market cap as a proxy for newer, smaller projects.
      </Alert>
      <CoinMarketsTable coins={coins} showRank={false} showSparkline={false} />
    </Container>
  );
}
