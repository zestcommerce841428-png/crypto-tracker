"use client";

import useSWR from "swr";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Chip from "@mui/material/Chip";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";

interface BinanceMarketRow {
  symbol: string;
  pair: string;
  price: number;
  changePercent24h: number;
  volumeQuoteUsdt: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BinanceLiveMarketsTable({ sort = "volume" }: { sort?: "volume" | "gainers" | "losers" }) {
  const { data, isLoading } = useSWR<BinanceMarketRow[]>(
    `/api/binance-markets?sort=${sort}&limit=100`,
    fetcher,
    { refreshInterval: 10000, revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <Paper variant="outlined">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} height={40} sx={{ mx: 2 }} />
        ))}
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24h Change</TableCell>
            <TableCell align="right">24h Volume (USDT)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? []).map((row) => (
            <TableRow key={row.pair} hover>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {row.symbol}
                  <Chip label="USDT" size="small" variant="outlined" sx={{ ml: 1, height: 18, fontSize: 10 }} />
                </Typography>
              </TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatCurrency(row.price, "usd")}
              </TableCell>
              <TableCell align="right">
                <PriceChangeChip value={row.changePercent24h} />
              </TableCell>
              <TableCell align="right">{formatCompactNumber(row.volumeQuoteUsdt, "usd")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
