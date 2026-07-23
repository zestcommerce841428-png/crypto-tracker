import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { getNftDetail, getNftMarketChart } from "@/lib/api/coingecko";
import { formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import SimpleAreaChart from "@/components/charts/SimpleAreaChart";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const nft = await getNftDetail(id);
    return {
      title: `${nft.name} — NFT Floor Price, Volume & Market Cap`,
      description: `${nft.name} floor price, 24h volume, market cap and holder stats.`,
      alternates: { canonical: `/nft/${id}` },
    };
  } catch {
    return { title: "NFT Collection Not Found" };
  }
}

export default async function NftDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let nft;
  try {
    nft = await getNftDetail(id);
  } catch {
    notFound();
  }

  const currency = nft.native_currency ?? "eth";
  const marketChart = await getNftMarketChart(id, 30).catch(() => null);
  const floorPriceSeries = (marketChart?.floor_price_usd ?? []).map(([time, value]) => ({ time, value }));

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={nft.image?.small} sx={{ width: 56, height: 56 }} />
          <Stack>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {nft.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nft.symbol} · {nft.asset_platform_id}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Floor Price
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {nft.floor_price?.[currency]?.toFixed(3)} {currency.toUpperCase()}
              </Typography>
              <PriceChangeChip value={nft.floor_price_24h_percentage_change?.[currency]} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Market Cap
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCompactNumber(nft.market_cap?.[currency])} {currency.toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                24h Volume
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCompactNumber(nft.volume_24h?.[currency])} {currency.toUpperCase()}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Unique Holders
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {nft.number_of_unique_addresses?.toLocaleString() ?? "—"}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {floorPriceSeries.length > 1 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              30-Day Floor Price (USD)
            </Typography>
            <SimpleAreaChart data={floorPriceSeries} valueSuffix=" USD" />
          </Paper>
        )}

        {nft.description && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {nft.description}
            </Typography>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
