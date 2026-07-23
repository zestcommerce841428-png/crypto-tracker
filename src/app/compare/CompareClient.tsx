"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import { formatCurrency, formatCompactNumber, formatSupply } from "@/lib/utils/format";
import type { CoinMarket } from "@/lib/types/coin";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const DEFAULT_IDS = ["bitcoin", "ethereum"];

function CoinPicker({
  onSelect,
  excludeIds,
}: {
  onSelect: (coin: SearchCoin) => void;
  excludeIds: string[];
}) {
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions((data.coins ?? []).filter((c: SearchCoin) => !excludeIds.includes(c.id)));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, excludeIds]);

  return (
    <Paper variant="outlined" sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200 }}>
      <Autocomplete
        sx={{ width: "100%" }}
        options={options}
        getOptionLabel={(o) => o.name}
        onInputChange={(_e, v) => setQuery(v)}
        onChange={(_e, v) => v && onSelect(v)}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
            <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} /> {option.name}
          </Box>
        )}
        renderInput={(params) => <TextField {...params} label="Add a coin to compare" />}
      />
    </Paper>
  );
}

export default function CompareClient() {
  const [ids, setIds] = React.useState<string[]>(DEFAULT_IDS);

  const { data: coins } = useSWR<CoinMarket[]>(
    ids.length > 0 ? `/api/markets?ids=${ids.join(",")}&per_page=10` : null,
    fetcher,
    { refreshInterval: 45000 }
  );

  const orderedCoins = ids
    .map((id) => coins?.find((c) => c.id === id))
    .filter((c): c is CoinMarket => Boolean(c));

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Compare Cryptocurrencies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compare up to 4 coins side by side.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {orderedCoins.map((coin) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={coin.id}>
            <Paper variant="outlined" sx={{ p: 2, position: "relative" }}>
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 4, right: 4 }}
                onClick={() => setIds((prev) => prev.filter((id) => id !== coin.id))}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
              <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <Avatar src={coin.image} sx={{ width: 48, height: 48 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {coin.name}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Row label="Price" value={formatCurrency(coin.current_price, "usd")} />
                <Row label="24h" value={<PriceChangeChip value={coin.price_change_percentage_24h} />} />
                <Row label="Market Cap" value={formatCompactNumber(coin.market_cap, "usd")} />
                <Row label="Volume" value={formatCompactNumber(coin.total_volume, "usd")} />
                <Row label="Circ. Supply" value={formatSupply(coin.circulating_supply)} />
                <Row label="Max Supply" value={formatSupply(coin.max_supply)} />
                <Row label="ATH" value={formatCurrency(coin.ath, "usd")} />
              </Stack>
            </Paper>
          </Grid>
        ))}
        {ids.length < 4 && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <CoinPicker
              excludeIds={ids}
              onSelect={(coin) => setIds((prev) => [...prev, coin.id])}
            />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value}
      </Typography>
    </Stack>
  );
}
