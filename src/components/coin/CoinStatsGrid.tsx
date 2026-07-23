"use client";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import type { CoinDetail } from "@/lib/types/coin";
import { formatCurrency, formatCompactNumber, formatSupply, formatDate } from "@/lib/utils/format";
import { useSettingsStore } from "@/lib/store/useSettingsStore";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function CoinStatsGrid({ coin }: { coin: CoinDetail }) {
  // CoinGecko's /coins/{id} endpoint returns market_data pre-populated for
  // every supported currency in one call, so switching currencies here is
  // just picking a different key — no extra fetch needed.
  const storeCurrency = useSettingsStore((s) => s.vsCurrency);
  const md = coin.market_data;
  const vsCurrency = md.current_price?.[storeCurrency] !== undefined ? storeCurrency : "usd";

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Market Stats
          </Typography>
          <Divider />
          <Row label="Market Cap Rank" value={`#${coin.market_cap_rank ?? "—"}`} />
          <Row label="Market Cap" value={formatCompactNumber(md.market_cap?.[vsCurrency], vsCurrency)} />
          <Row
            label="Fully Diluted Valuation"
            value={formatCompactNumber(md.fully_diluted_valuation?.[vsCurrency], vsCurrency)}
          />
          <Row label="24h Trading Volume" value={formatCompactNumber(md.total_volume?.[vsCurrency], vsCurrency)} />
          <Row label="24h Low / High" value={`${formatCurrency(md.low_24h?.[vsCurrency], vsCurrency)} / ${formatCurrency(md.high_24h?.[vsCurrency], vsCurrency)}`} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Supply
          </Typography>
          <Divider />
          <Row label="Circulating Supply" value={formatSupply(md.circulating_supply)} />
          <Row label="Total Supply" value={formatSupply(md.total_supply)} />
          <Row label="Max Supply" value={formatSupply(md.max_supply)} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            All-Time High
          </Typography>
          <Divider />
          <Row label="Price" value={formatCurrency(md.ath?.[vsCurrency], vsCurrency)} />
          <Row label="Change" value={`${md.ath_change_percentage?.[vsCurrency]?.toFixed(1)}%`} />
          <Row label="Date" value={formatDate(md.ath_date?.[vsCurrency])} />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            All-Time Low
          </Typography>
          <Divider />
          <Row label="Price" value={formatCurrency(md.atl?.[vsCurrency], vsCurrency)} />
          <Row label="Change" value={`+${md.atl_change_percentage?.[vsCurrency]?.toFixed(1)}%`} />
          <Row label="Date" value={formatDate(md.atl_date?.[vsCurrency])} />
        </Paper>
      </Grid>
    </Grid>
  );
}
