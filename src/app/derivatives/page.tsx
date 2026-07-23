import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { getDerivatives, getDerivativesExchanges } from "@/lib/api/coingecko";
import { formatCompactNumber, formatCurrency, formatPercent } from "@/lib/utils/format";
import LinkTableRow from "@/components/common/LinkTableRow";

// No `revalidate` export — getDerivatives() fetches with cache: "no-store"
// (its payload is too large for Next's 2MB data cache), so this route
// renders fully dynamically on every request regardless.

export const metadata: Metadata = {
  title: "Crypto Derivatives — Futures & Perpetuals Market Data",
  description:
    "Live cryptocurrency futures and perpetual contracts data: funding rates, open interest, and 24h volume across major derivatives exchanges.",
  alternates: { canonical: "/derivatives" },
};

export default async function DerivativesPage() {
  const [tickers, exchanges] = await Promise.all([
    getDerivatives().catch(() => []),
    getDerivativesExchanges().catch(() => []),
  ]);

  const topTickers = tickers
    .filter((t) => t.contract_type === "perpetual")
    .sort((a, b) => b.open_interest - a.open_interest)
    .slice(0, 30);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Derivatives
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live perpetual futures data — funding rates, open interest and volume across major
          derivatives exchanges.
        </Typography>
      </Stack>

      {topTickers.length > 0 && (
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Exchange</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">24h Change</TableCell>
                <TableCell align="right">Funding Rate</TableCell>
                <TableCell align="right">Open Interest ($)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topTickers.map((t, i) => (
                <TableRow key={`${t.market}-${t.symbol}-${i}`} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{t.symbol}</TableCell>
                  <TableCell>{t.market}</TableCell>
                  <TableCell align="right">{formatCurrency(Number(t.price), "usd")}</TableCell>
                  <TableCell align="right">{formatPercent(t.price_percentage_change_24h)}</TableCell>
                  <TableCell align="right">{(t.funding_rate ?? 0).toFixed(4)}%</TableCell>
                  <TableCell align="right">{formatCompactNumber(t.open_interest, "usd")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {exchanges.length > 0 && (
        <>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Derivatives Exchanges
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Exchange</TableCell>
                  <TableCell align="right">Open Interest (BTC)</TableCell>
                  <TableCell align="right">24h Volume (BTC)</TableCell>
                  <TableCell align="center">Perpetual Pairs</TableCell>
                  <TableCell align="center">Futures Pairs</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {exchanges.slice(0, 20).map((ex) => (
                  <LinkTableRow key={ex.id} href={`/derivatives/${ex.id}`}>
                    <TableCell sx={{ fontWeight: 600 }}>{ex.name}</TableCell>
                    <TableCell align="right">{formatCompactNumber(ex.open_interest_btc)}</TableCell>
                    <TableCell align="right">{formatCompactNumber(Number(ex.trade_volume_24h_btc))}</TableCell>
                    <TableCell align="center">
                      <Chip size="small" label={ex.number_of_perpetual_pairs} variant="outlined" />
                    </TableCell>
                    <TableCell align="center">
                      <Chip size="small" label={ex.number_of_futures_pairs} variant="outlined" />
                    </TableCell>
                  </LinkTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
}
