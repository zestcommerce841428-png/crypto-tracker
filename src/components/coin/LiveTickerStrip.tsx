"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CoinIcon from "@/components/common/CoinIcon";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useLiveTicker } from "@/lib/hooks/useLiveTicker";
import { formatCurrency } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";

export interface TickerCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number;
  change24h: number;
}

export default function LiveTickerStrip({ coins }: { coins: TickerCoin[] }) {
  const symbols = coins.map((c) => c.symbol);
  const { ticks, status } = useLiveTicker(symbols);

  return (
    <Box
      sx={{
        overflowX: "auto",
        display: "flex",
        gap: 1,
        py: 1,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {coins.map((coin) => {
        const live = ticks[coin.symbol.toLowerCase()];
        const isLive = status === "open" && Boolean(live);
        const price = isLive ? live.price : coin.price;
        const change = isLive ? live.changePercent : coin.change24h;
        return (
          <Stack
            key={coin.id}
            component={Link}
            href={`/coin/${coin.id}`}
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              flexShrink: 0,
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <CoinIcon src={coin.image} alt={coin.name} size={20} />
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {coin.symbol.toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
              {formatCurrency(price, "usd")}
            </Typography>
            <PriceChangeChip value={change} />
            {isLive && (
              <Chip
                label="●"
                size="small"
                color="success"
                sx={{
                  height: 16,
                  minWidth: 16,
                  "& .MuiChip-label": { px: 0.5, fontSize: 10 },
                }}
              />
            )}
          </Stack>
        );
      })}
    </Box>
  );
}
