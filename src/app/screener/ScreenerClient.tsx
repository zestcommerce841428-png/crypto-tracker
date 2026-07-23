"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";
import type { CoinMarket } from "@/lib/types/coin";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SortKey = "market_cap_desc" | "price_change_percentage_24h" | "total_volume" | "current_price";

export default function ScreenerClient() {
  const { data: coins, isLoading } = useSWR<CoinMarket[]>(
    "/api/markets?per_page=250&page=1",
    fetcher,
    { refreshInterval: 60000 }
  );

  const [minPrice, setMinPrice] = React.useState("");
  const [maxPrice, setMaxPrice] = React.useState("");
  const [minMarketCap, setMinMarketCap] = React.useState("");
  const [minChange24h, setMinChange24h] = React.useState("");
  const [sortKey, setSortKey] = React.useState<SortKey>("market_cap_desc");

  const filtered = (coins ?? [])
    .filter((c) => (minPrice ? c.current_price >= Number(minPrice) : true))
    .filter((c) => (maxPrice ? c.current_price <= Number(maxPrice) : true))
    .filter((c) => (minMarketCap ? c.market_cap >= Number(minMarketCap) : true))
    .filter((c) => (minChange24h ? c.price_change_percentage_24h >= Number(minChange24h) : true))
    .sort((a, b) => {
      switch (sortKey) {
        case "price_change_percentage_24h":
          return (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0);
        case "total_volume":
          return b.total_volume - a.total_volume;
        case "current_price":
          return b.current_price - a.current_price;
        default:
          return b.market_cap - a.market_cap;
      }
    });

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Screener
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Filter the top 250 coins by market cap using custom criteria.
        </Typography>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label="Min price ($)"
              type="number"
              size="small"
              fullWidth
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label="Max price ($)"
              type="number"
              size="small"
              fullWidth
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label="Min market cap ($)"
              type="number"
              size="small"
              fullWidth
              value={minMarketCap}
              onChange={(e) => setMinMarketCap(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              label="Min 24h change (%)"
              type="number"
              size="small"
              fullWidth
              value={minChange24h}
              onChange={(e) => setMinChange24h(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select
                label="Sort by"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
              >
                <MenuItem value="market_cap_desc">Market Cap</MenuItem>
                <MenuItem value="price_change_percentage_24h">24h Change</MenuItem>
                <MenuItem value="total_volume">Volume</MenuItem>
                <MenuItem value="current_price">Price</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="body2" color="text.secondary">
        {filtered.length} coins match your filters
      </Typography>

      <CoinMarketsTable coins={filtered.slice(0, 100)} isLoading={isLoading} />
    </Stack>
  );
}
