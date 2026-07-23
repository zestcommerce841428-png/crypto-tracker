import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { getMarkets } from "@/lib/api/coingecko";
import { formatCurrency, formatCompactNumber, formatSupply } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import ShareButton from "@/components/common/ShareButton";

export const revalidate = 90;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

function parseSlug(slug: string): [string, string] | null {
  const parts = slug.split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Compare Coins" };
  const [a, b] = parsed;
  const title = `${a} vs ${b} — Price, Market Cap & Volume Comparison`;
  return {
    title,
    description: `Side-by-side comparison of ${a} and ${b}: live price, market cap, 24h volume, supply and all-time high.`,
    alternates: { canonical: `/compare/${slug}` },
  };
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default async function ComparePairPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();
  const [idA, idB] = parsed;

  const coins = await getMarkets({ ids: [idA, idB], perPage: 10, sparkline: false });
  const coinA = coins.find((c) => c.id === idA);
  const coinB = coins.find((c) => c.id === idB);

  if (!coinA || !coinB) notFound();

  const pair = [coinA, coinB];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {coinA.name} vs {coinB.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Live comparison of price, market cap, volume and supply.
          </Typography>
        </Stack>
        <ShareButton title={`${coinA.name} vs ${coinB.name} — CryptoTracker`} />
      </Stack>

      <Grid container spacing={2}>
        {pair.map((coin) => (
          <Grid size={{ xs: 12, sm: 6 }} key={coin.id}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar src={coin.image} sx={{ width: 48, height: 48 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {coin.name}
                </Typography>
              </Stack>
              <Row label="Price" value={formatCurrency(coin.current_price, "usd")} />
              <Row label="24h Change" value={<PriceChangeChip value={coin.price_change_percentage_24h} />} />
              <Row label="Market Cap" value={formatCompactNumber(coin.market_cap, "usd")} />
              <Row label="Market Cap Rank" value={`#${coin.market_cap_rank}`} />
              <Row label="24h Volume" value={formatCompactNumber(coin.total_volume, "usd")} />
              <Row label="Circ. Supply" value={formatSupply(coin.circulating_supply)} />
              <Row label="Max Supply" value={formatSupply(coin.max_supply)} />
              <Row label="All-Time High" value={formatCurrency(coin.ath, "usd")} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
