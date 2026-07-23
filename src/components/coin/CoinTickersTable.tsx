import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import type { CoinTicker } from "@/lib/types/coin";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";

export default function CoinTickersTable({
  coinId,
  tickers,
}: {
  coinId: string;
  tickers: CoinTicker[];
}) {
  const rows = tickers.slice(0, 15);
  if (rows.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Markets
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Exchange</TableCell>
              <TableCell>Pair</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">24h Volume</TableCell>
              <TableCell align="center">Trust</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((ticker, i) => (
              <TableRow key={`${ticker.market.identifier}-${i}`} hover>
                <TableCell>{ticker.market.name}</TableCell>
                <TableCell>
                  {ticker.base}/{ticker.target}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(ticker.converted_last?.usd, "usd")}
                </TableCell>
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
      {tickers.length > 15 && (
        <Button href={`/coin/${coinId}/markets`} size="small" sx={{ mt: 1 }}>
          View all {tickers.length} markets
        </Button>
      )}
    </Paper>
  );
}
