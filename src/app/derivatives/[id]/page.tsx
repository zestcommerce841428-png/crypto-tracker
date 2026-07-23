import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import { getDerivativesExchangeDetail } from "@/lib/api/coingecko";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/utils/format";

// getDerivativesExchangeDetail() fetches with cache: "no-store" (its
// tickers payload is too large for Next's 2MB data cache). Declaring the
// route force-dynamic up front avoids Next's "static to dynamic at
// runtime" error, which occurs when a route with generateStaticParams
// only discovers a no-store fetch at request time.
export const dynamic = "force-dynamic";
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
    const ex = await getDerivativesExchangeDetail(id);
    return {
      title: `${ex.name} — Derivatives Exchange, Open Interest & Volume`,
      description: `${ex.name} open interest, 24h volume, and top perpetual/futures contracts.`,
      alternates: { canonical: `/derivatives/${id}` },
    };
  } catch {
    return { title: "Derivatives Exchange Not Found" };
  }
}

export default async function DerivativesExchangeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let ex;
  try {
    ex = await getDerivativesExchangeDetail(id);
  } catch {
    notFound();
  }

  const tickers = (ex.tickers ?? []).slice(0, 20);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar src={ex.image} sx={{ width: 56, height: 56 }} />
          <Stack>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {ex.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {ex.country ?? "Unknown location"} · Est. {ex.year_established ?? "—"}
            </Typography>
          </Stack>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Open Interest</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCompactNumber(ex.open_interest_btc)} BTC</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">24h Volume</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCompactNumber(Number(ex.trade_volume_24h_btc))} BTC</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Perpetual Pairs</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{ex.number_of_perpetual_pairs}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">Futures Pairs</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{ex.number_of_futures_pairs}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {ex.description && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>About</Typography>
            <Typography variant="body2" color="text.secondary">{ex.description}</Typography>
          </Paper>
        )}

        {tickers.length > 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Top Contracts</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">24h Change</TableCell>
                  <TableCell align="right">Open Interest ($)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickers.map((t, i) => (
                  <TableRow key={`${t.symbol}-${i}`} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{t.symbol}</TableCell>
                    <TableCell align="right">{formatCurrency(Number(t.price), "usd")}</TableCell>
                    <TableCell align="right">{formatPercent(t.price_percentage_change_24h)}</TableCell>
                    <TableCell align="right">{formatCompactNumber(t.open_interest, "usd")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Stack>
    </Container>
  );
}
