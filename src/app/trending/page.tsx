import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { getTrending } from "@/lib/api/coingecko";
import { formatCurrency } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import LinkCard from "@/components/common/LinkCard";

export const dynamic = "force-dynamic";
export const revalidate = 180;

export const metadata: Metadata = {
  title: "Trending Cryptocurrencies — Most Searched Coins Today",
  description:
    "See the top 15 trending cryptocurrencies on CoinGecko right now, ranked by search popularity over the last 24 hours.",
  alternates: { canonical: "/trending" },
};

export default async function TrendingPage() {
  const { coins } = await getTrending();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Trending Coins
        </Typography>
        <Typography variant="body1" color="text.secondary">
          The most searched cryptocurrencies on CoinGecko in the last 24 hours.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {coins.map((entry, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.item.id}>
            <LinkCard href={`/coin/${entry.item.id}`}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h6" color="text.secondary" sx={{ width: 24 }}>
                  {i + 1}
                </Typography>
                <Avatar src={entry.item.large} sx={{ width: 40, height: 40 }} />
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                    {entry.item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {entry.item.symbol?.toUpperCase()} · Rank #{entry.item.market_cap_rank ?? "—"}
                  </Typography>
                </Box>
              </Stack>
              {entry.item.data && (
                <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(entry.item.data.price, "usd")}
                  </Typography>
                  <PriceChangeChip value={entry.item.data.price_change_percentage_24h?.usd} />
                </Stack>
              )}
              {entry.item.data?.market_cap && (
                <Typography variant="caption" color="text.secondary">
                  Market Cap: {entry.item.data.market_cap}
                </Typography>
              )}
            </LinkCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
