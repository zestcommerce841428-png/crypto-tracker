"use client";

import Link from "next/link";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CoinIcon from "@/components/common/CoinIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import type { CoinMarket } from "@/lib/types/coin";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import Sparkline from "@/components/charts/Sparkline";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";

export default function CoinGridView({
  coins,
  vsCurrency = "usd",
  isLoading = false,
}: {
  coins: CoinMarket[];
  vsCurrency?: string;
  isLoading?: boolean;
}) {
  const watched = useWatchlistStore((s) => s.coinIds);
  const toggleWatch = useWatchlistStore((s) => s.toggle);

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
            <Skeleton variant="rounded" height={160} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      {coins.map((coin) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={coin.id}>
          <Paper
            component={Link}
            href={`/coin/${coin.id}`}
            variant="outlined"
            sx={{
              p: 2,
              display: "block",
              height: "100%",
              "&:hover": { borderColor: "primary.main" },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <CoinIcon src={coin.image} alt={coin.name} size={28} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
                    {coin.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {coin.symbol?.toUpperCase()} · #{coin.market_cap_rank}
                  </Typography>
                </Box>
              </Stack>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  toggleWatch(coin.id);
                }}
                aria-label="Toggle watchlist"
              >
                {watched.includes(coin.id) ? (
                  <StarRoundedIcon fontSize="small" color="warning" />
                ) : (
                  <StarBorderRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Stack>

            <Box sx={{ my: 1 }}>
              <Sparkline data={coin.sparkline_in_7d?.price ?? []} width={220} height={50} />
            </Box>

            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="body1" sx={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                {formatCurrency(coin.current_price, vsCurrency)}
              </Typography>
              <PriceChangeChip value={coin.price_change_percentage_24h} />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              MCap {formatCompactNumber(coin.market_cap, vsCurrency)}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
