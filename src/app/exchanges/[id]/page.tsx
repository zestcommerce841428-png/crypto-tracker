import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";
import { getExchangeDetail, getExchangeVolumeChart } from "@/lib/api/coingecko";
import { formatCompactNumber, formatCurrency } from "@/lib/utils/format";
import SimpleAreaChart from "@/components/charts/SimpleAreaChart";

export const revalidate = 600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

interface ExchangeTicker {
  base: string;
  target: string;
  last: number;
  volume: number;
  trust_score: string | null;
  market: { name: string };
}

interface ExchangeDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  year_established: number | null;
  country: string | null;
  trust_score: number | null;
  trust_score_rank: number | null;
  trade_volume_24h_btc: number;
  tickers?: ExchangeTicker[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const exchange = (await getExchangeDetail(id)) as ExchangeDetail;
    return {
      title: `${exchange.name} — Exchange Info, Trust Score & Volume`,
      description: `${exchange.name} trading volume, trust score rank #${exchange.trust_score_rank}, established ${exchange.year_established ?? "N/A"}.`,
      alternates: { canonical: `/exchanges/${id}` },
    };
  } catch {
    return { title: "Exchange Not Found" };
  }
}

export default async function ExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let exchange: ExchangeDetail;
  try {
    exchange = (await getExchangeDetail(id)) as ExchangeDetail;
  } catch {
    notFound();
  }

  const volumeChart = await getExchangeVolumeChart(id, 30).catch(() => []);
  const volumeSeries = volumeChart.map(([time, volume]) => ({ time, value: Number(volume) }));
  const tickers = (exchange.tickers ?? []).slice(0, 15);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={exchange.image} sx={{ width: 56, height: 56 }} />
          <Stack>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {exchange.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {exchange.country ?? "Unknown location"} · Est. {exchange.year_established ?? "—"}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Trust Score
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {exchange.trust_score ?? "—"}/10
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Trust Rank
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                #{exchange.trust_score_rank ?? "—"}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 4 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                24h Volume
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {formatCompactNumber(exchange.trade_volume_24h_btc)} BTC
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {volumeSeries.length > 1 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              30-Day Volume (BTC)
            </Typography>
            <SimpleAreaChart data={volumeSeries} valueSuffix=" BTC" />
          </Paper>
        )}

        {exchange.description && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              About
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary">
              {exchange.description}
            </Typography>
          </Paper>
        )}

        {tickers.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Top Trading Pairs
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Pair</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="center">Trust</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickers.map((t, i) => (
                  <TableRow key={`${t.base}-${t.target}-${i}`} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {t.base}/{t.target}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(t.last, "usd")}</TableCell>
                    <TableCell align="right">{formatCompactNumber(t.volume)}</TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={t.trust_score ?? "n/a"}
                        color={t.trust_score === "green" ? "success" : t.trust_score === "yellow" ? "warning" : "default"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {exchange.url && (
          <Button href={exchange.url} target="_blank" rel="noopener noreferrer" variant="outlined" sx={{ alignSelf: "flex-start" }}>
            Visit {exchange.name}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
