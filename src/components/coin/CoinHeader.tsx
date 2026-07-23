"use client";

import Stack from "@mui/material/Stack";
import CoinIcon from "@/components/common/CoinIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import { formatCurrency, formatPercent } from "@/lib/utils/format";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { useAccessibilityStore } from "@/lib/store/useAccessibilityStore";
import { useLiveTicker } from "@/lib/hooks/useLiveTicker";
import { speakText } from "@/lib/utils/speech";

export default function CoinHeader({
  id,
  name,
  symbol,
  image,
  rank,
  priceByCurrency,
  change24h,
}: {
  id: string;
  name: string;
  symbol: string;
  image: string;
  rank: number;
  priceByCurrency: Record<string, number>;
  change24h: number;
}) {
  const isWatched = useWatchlistStore((s) => s.isWatched(id));
  const toggle = useWatchlistStore((s) => s.toggle);
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const ttsRate = useAccessibilityStore((s) => s.ttsRate);

  // CoinGecko's /coins/{id} response already includes current_price for
  // every supported currency in one call, so switching currencies here is
  // just picking a different key from data we already have — no re-fetch.
  const storeCurrency = useSettingsStore((s) => s.vsCurrency);
  const vsCurrency = priceByCurrency?.[storeCurrency] !== undefined ? storeCurrency : "usd";
  const price = priceByCurrency?.[vsCurrency];

  // Binance's public pairs are USDT-denominated, so the live override only
  // applies when browsing in USD; other currencies keep the ISR-cached price.
  const liveEligible = vsCurrency === "usd";
  const { ticks, status } = useLiveTicker(liveEligible ? [symbol] : []);
  const live = ticks[symbol.toLowerCase()];
  const isLive = liveEligible && status === "open" && Boolean(live);

  const displayPrice = isLive ? live.price : price;
  const displayChange = isLive ? live.changePercent : change24h;

  return (
    <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
      <CoinIcon src={image} alt={name} size={56} priority />
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {name}
          </Typography>
          <Chip label={symbol.toUpperCase()} size="small" />
          <Chip label={`Rank #${rank}`} size="small" variant="outlined" />
          {isLive && (
            <Tooltip title="Live price from Binance">
              <Chip
                label="LIVE"
                size="small"
                color="success"
                sx={{
                  fontWeight: 700,
                  "& .MuiChip-label": { px: 1 },
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                  },
                }}
              />
            </Tooltip>
          )}
          <Tooltip title={isWatched ? "Remove from watchlist" : "Add to watchlist"}>
            <IconButton size="small" onClick={() => toggle(id)}>
              {isWatched ? (
                <StarRoundedIcon color="warning" />
              ) : (
                <StarBorderRoundedIcon />
              )}
            </IconButton>
          </Tooltip>
          {ttsEnabled && (
            <Tooltip title="Read price aloud">
              <IconButton
                size="small"
                onClick={() =>
                  speakText(
                    `${name}. Current price: ${formatCurrency(displayPrice, vsCurrency)}. 24 hour change: ${formatPercent(displayChange)}.`,
                    ttsRate
                  )
                }
                aria-label="Read price aloud"
              >
                <VolumeUpRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
        <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mt: 0.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {formatCurrency(displayPrice, vsCurrency)}
          </Typography>
          <PriceChangeChip value={displayChange} variant="filled" />
        </Stack>
      </Box>
    </Stack>
  );
}
