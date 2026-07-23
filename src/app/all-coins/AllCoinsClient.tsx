"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/SearchRounded";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Link from "next/link";
import CoinIcon from "@/components/common/CoinIcon";

interface CoinListItem {
  id: string;
  symbol: string;
  name: string;
  image?: string;
}

const LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];
const RENDER_CAP = 400;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function letterOf(name: string): string {
  const ch = name.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}

export default function AllCoinsClient() {
  const [query, setQuery] = React.useState("");
  const [letter, setLetter] = React.useState("A");

  // Fetched once client-side (long-cached) rather than embedded as a
  // ~16,000-item server-to-client prop, which was re-serializing the whole
  // list into every page's RSC payload and ballooning memory under load.
  const { data: coins, isLoading } = useSWR<CoinListItem[]>(
    "/api/coins-list",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 3600000 }
  );

  const filtered = React.useMemo(() => {
    if (!coins) return [];
    const q = query.trim().toLowerCase();
    if (q.length > 0) {
      return coins.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    return coins.filter((c) => letterOf(c.name) === letter);
  }, [coins, query, letter]);

  const visible = filtered.slice(0, RENDER_CAP);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={40} />
        <Skeleton variant="rounded" height={480} />
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <TextField
        placeholder="Search all coins by name or symbol…"
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

      {query.trim().length === 0 && (
        <Tabs
          value={letter}
          onChange={(_e, v) => setLetter(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {LETTERS.map((l) => (
            <Tab key={l} value={l} label={l} sx={{ minWidth: 36 }} />
          ))}
        </Tabs>
      )}

      <Typography variant="caption" color="text.secondary">
        Showing {visible.length.toLocaleString()} of {filtered.length.toLocaleString()} matching
        coins{filtered.length > RENDER_CAP ? " — refine your search to narrow the list" : ""}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Grid container spacing={1}>
          {visible.map((coin) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={coin.id}>
              <Box
                component={Link}
                href={`/coin/${coin.id}`}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  py: 0.5,
                  color: "text.primary",
                  minWidth: 0,
                  "&:hover": { color: "primary.main" },
                }}
              >
                <CoinIcon src={coin.image} alt={coin.name} size={20} />
                <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                  {coin.name}{" "}
                  <Typography component="span" variant="caption" color="text.secondary">
                    {coin.symbol.toUpperCase()}
                  </Typography>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Stack>
  );
}
