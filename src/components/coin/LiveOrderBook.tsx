"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { openBinanceDepthWs, binanceSymbolFor, type OrderBookSnapshot } from "@/lib/api/binance";
import { formatCurrency } from "@/lib/utils/format";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";

export default function LiveOrderBook({ symbol }: { symbol: string }) {
  const [book, setBook] = React.useState<OrderBookSnapshot | null>(null);
  const { gain: gainColor, loss: lossColor } = useGainLossColors();
  const binanceSymbol = binanceSymbolFor(symbol);

  React.useEffect(() => {
    setBook(null);
    const close = openBinanceDepthWs(binanceSymbol, setBook);
    return close;
  }, [binanceSymbol]);

  if (!book) return null;

  const asks = [...book.asks].sort((a, b) => a.price - b.price).slice(0, 10).reverse();
  const bids = [...book.bids].sort((a, b) => b.price - a.price).slice(0, 10);
  const allQuantities = [...asks, ...bids].map((l) => l.quantity);
  const maxQty = Math.max(...allQuantities, 1);

  const Row = ({ price, quantity, color }: { price: number; quantity: number; color: string }) => (
    <Box sx={{ position: "relative", py: 0.25 }}>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: `${Math.min(100, (quantity / maxQty) * 100)}%`,
          bgcolor: color,
          opacity: 0.12,
        }}
      />
      <Stack direction="row" justifyContent="space-between" sx={{ position: "relative", px: 1 }}>
        <Typography variant="caption" sx={{ color, fontVariantNumeric: "tabular-nums" }}>
          {formatCurrency(price, "usd")}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {quantity.toFixed(4)}
        </Typography>
      </Stack>
    </Box>
  );

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Live Order Book
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
        {binanceSymbol} order book from Binance
      </Typography>
      <Box>
        {asks.map((level) => (
          <Row key={`ask-${level.price}`} price={level.price} quantity={level.quantity} color={lossColor} />
        ))}
      </Box>
      <Box sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider", my: 0.5 }} />
      <Box>
        {bids.map((level) => (
          <Row key={`bid-${level.price}`} price={level.price} quantity={level.quantity} color={gainColor} />
        ))}
      </Box>
    </Paper>
  );
}
