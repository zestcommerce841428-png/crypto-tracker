import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { getMarkets } from "@/lib/api/coingecko";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Proof-of-Stake Coins — Top Staking Cryptocurrencies",
  description:
    "Browse the top proof-of-stake cryptocurrencies by market cap, commonly used for staking and earning network rewards.",
  alternates: { canonical: "/staking" },
};

export default async function StakingPage() {
  const coins = await getMarkets({
    category: "proof-of-stake-pos",
    perPage: 100,
    page: 1,
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Proof-of-Stake Coins
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top proof-of-stake cryptocurrencies by market cap — commonly stakeable for network
          rewards.
        </Typography>
      </Stack>
      <Alert severity="info" sx={{ mb: 2 }}>
        Staking APYs vary by network, validator, and lock-up terms and aren&apos;t shown here —
        always check the specifics on the chain or exchange where you stake.
      </Alert>
      <CoinMarketsTable coins={coins} />
    </Container>
  );
}
