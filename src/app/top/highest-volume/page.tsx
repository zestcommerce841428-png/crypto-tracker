import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getMarkets } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Highest Trading Volume — Top 100 Coins by 24h Volume",
  description:
    "The top 100 cryptocurrencies ranked by 24-hour trading volume, a key signal of liquidity and market interest.",
  alternates: { canonical: "/top/highest-volume" },
};

export default async function HighestVolumePage() {
  const coins = await getMarkets({
    perPage: 100,
    page: 1,
    order: "volume_desc",
    sparkline: false,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Highest Trading Volume
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top 100 cryptocurrencies ranked by 24-hour trading volume.
        </Typography>
      </Stack>
      <CoinMarketsTable coins={coins} showRank={false} />
    </Container>
  );
}
