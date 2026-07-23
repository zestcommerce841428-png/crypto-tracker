import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getCoinDetail } from "@/lib/api/coingecko";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";

export const revalidate = 90;
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
    const coin = await getCoinDetail(id);
    return {
      title: `${coin.name} Markets — Exchanges, Pairs & Trading Volume`,
      description: `Full list of exchanges and trading pairs for ${coin.name} (${coin.symbol.toUpperCase()}), with live prices and 24h volume.`,
      alternates: { canonical: `/coin/${id}/markets` },
    };
  } catch {
    return { title: "Coin Not Found" };
  }
}

export default async function CoinMarketsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let coin;
  try {
    coin = await getCoinDetail(id);
  } catch {
    notFound();
  }

  const tickers = coin.tickers ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          {coin.name} Markets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All {tickers.length} tracked trading pairs for {coin.name} ({coin.symbol.toUpperCase()}).
        </Typography>
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Exchange</TableCell>
              <TableCell>Pair</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">24h Volume</TableCell>
              <TableCell align="center">Trust</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickers.map((ticker, i) => (
              <TableRow key={`${ticker.market.identifier}-${i}`} hover>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{ticker.market.name}</TableCell>
                <TableCell>
                  {ticker.base}/{ticker.target}
                </TableCell>
                <TableCell align="right">{formatCurrency(ticker.converted_last?.usd, "usd")}</TableCell>
                <TableCell align="right">{formatCompactNumber(ticker.volume, "usd")}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={ticker.trust_score ?? "n/a"}
                    color={
                      ticker.trust_score === "green"
                        ? "success"
                        : ticker.trust_score === "yellow"
                          ? "warning"
                          : "default"
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
