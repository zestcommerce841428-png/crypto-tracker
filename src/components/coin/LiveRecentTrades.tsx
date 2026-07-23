"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { openBinanceTradeWs, binanceSymbolFor, type LiveTrade } from "@/lib/api/binance";
import { formatCurrency } from "@/lib/utils/format";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";

const MAX_TRADES = 25;

export default function LiveRecentTrades({ symbol }: { symbol: string }) {
  const [trades, setTrades] = React.useState<LiveTrade[]>([]);
  const { gain, loss } = useGainLossColors();
  const binanceSymbol = binanceSymbolFor(symbol);

  React.useEffect(() => {
    setTrades([]);
    const close = openBinanceTradeWs(binanceSymbol, (trade) => {
      setTrades((prev) => [trade, ...prev].slice(0, MAX_TRADES));
    });
    return close;
  }, [binanceSymbol]);

  if (trades.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Recent Trades
        </Typography>
        <Chip
          label="LIVE"
          size="small"
          color="success"
          sx={{
            fontWeight: 700,
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
          }}
        />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
        Live executed trades on {binanceSymbol} (Binance)
      </Typography>
      <Stack sx={{ maxHeight: 320, overflowY: "auto" }}>
        {trades.map((trade) => (
          <Stack
            key={trade.id}
            direction="row"
            justifyContent="space-between"
            sx={{ py: 0.4, borderBottom: 1, borderColor: "divider" }}
          >
            <Typography
              variant="caption"
              sx={{ color: trade.isBuyerMaker ? loss : gain, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
            >
              {formatCurrency(trade.price, "usd")}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
              {trade.quantity.toFixed(5)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(trade.time).toLocaleTimeString()}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
