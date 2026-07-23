import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { getGlobalDefi, getMarkets } from "@/lib/api/coingecko";
import StatCard from "@/components/common/StatCard";
import { formatCompactNumber } from "@/lib/utils/format";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "DeFi Market Overview — Total Value, Dominance & Top Protocols",
  description:
    "Track the total DeFi market cap, DeFi dominance versus Bitcoin, and the top decentralized finance protocols by market cap.",
  alternates: { canonical: "/defi" },
};

export default async function DefiPage() {
  const [defi, coins] = await Promise.all([
    getGlobalDefi().catch(() => null),
    getMarkets({ category: "decentralized-finance-defi", perPage: 50, page: 1 }),
  ]);
  const d = defi?.data;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          DeFi Market Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Total value locked across decentralized finance protocols and top DeFi tokens by
          market cap.
        </Typography>
      </Stack>

      {d && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="DeFi Market Cap" value={formatCompactNumber(Number(d.defi_market_cap), "usd")} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="DeFi 24h Volume" value={formatCompactNumber(Number(d.trading_volume_24h), "usd")} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="DeFi Dominance" value={`${Number(d.defi_dominance).toFixed(2)}%`} />
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <StatCard label="Top DeFi Token" value={d.top_coin_name} />
          </Grid>
        </Grid>
      )}

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Top DeFi Tokens
      </Typography>
      <CoinMarketsTable coins={coins} />
    </Container>
  );
}
