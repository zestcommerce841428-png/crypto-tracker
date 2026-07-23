"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/SearchRounded";

interface BinancePair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const RENDER_CAP = 500;

export default function BinancePairsClient() {
  const [query, setQuery] = React.useState("");
  const { data: pairs, isLoading } = useSWR<BinancePair[]>("/api/binance-pairs", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 3600000,
  });

  const filtered = React.useMemo(() => {
    if (!pairs) return [];
    const q = query.trim().toUpperCase();
    if (!q) return pairs.slice(0, RENDER_CAP);
    return pairs
      .filter((p) => p.baseAsset.includes(q) || p.quoteAsset.includes(q) || p.symbol.includes(q))
      .slice(0, RENDER_CAP);
  }, [pairs, query]);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={480} />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <TextField
        placeholder="Search by asset, e.g. BTC or USDT…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        Showing {filtered.length.toLocaleString()} of {pairs?.length.toLocaleString()} live pairs
      </Typography>
      <Grid container spacing={1}>
        {filtered.map((pair) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={pair.symbol}>
            <Chip
              label={`${pair.baseAsset}/${pair.quoteAsset}`}
              variant="outlined"
              sx={{ width: "100%", justifyContent: "flex-start" }}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
