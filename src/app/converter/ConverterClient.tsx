"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import { VS_CURRENCIES } from "@/lib/utils/format";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function useCoinSearch(initialQuery: string) {
  const [query, setQuery] = React.useState(initialQuery);
  const [options, setOptions] = React.useState<SearchCoin[]>([]);

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.coins ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return { options, setQuery };
}

export default function ConverterClient() {
  const [amount, setAmount] = React.useState("1");
  const [fromCoin, setFromCoin] = React.useState<SearchCoin>({
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    thumb: "",
  });
  const [toMode, setToMode] = React.useState<"fiat" | "coin">("fiat");
  const [toCurrency, setToCurrency] = React.useState("usd");
  const [toCoin, setToCoin] = React.useState<SearchCoin | null>(null);

  const fromSearch = useCoinSearch("");
  const toSearch = useCoinSearch("");

  const ids = toMode === "coin" && toCoin ? `${fromCoin.id},${toCoin.id}` : fromCoin.id;
  const vsCurrency = toMode === "fiat" ? toCurrency : "usd";

  const { data } = useSWR<Array<{ id: string; current_price: number }>>(
    `/api/markets?ids=${ids}&vs_currency=${vsCurrency}&per_page=10`,
    fetcher,
    { refreshInterval: 30000 }
  );

  const fromPrice = data?.find((c) => c.id === fromCoin.id)?.current_price ?? 0;
  const toPrice = toMode === "coin" ? data?.find((c) => c.id === toCoin?.id)?.current_price ?? 0 : 1;

  const result =
    toMode === "fiat"
      ? Number(amount || 0) * fromPrice
      : toPrice > 0
        ? (Number(amount || 0) * fromPrice) / toPrice
        : 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Crypto Converter
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Convert between any cryptocurrency and fiat or another coin, live.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="caption" color="text.secondary">
            Amount
          </Typography>
          <Stack direction="row" spacing={1}>
            <TextField
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              fullWidth
            />
            <Autocomplete
              sx={{ width: 220 }}
              options={fromSearch.options}
              value={fromCoin}
              getOptionLabel={(o) => o.symbol.toUpperCase()}
              onInputChange={(_e, v) => fromSearch.setQuery(v)}
              onChange={(_e, v) => v && setFromCoin(v)}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderOption={(props, option) => (
                <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                  <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} /> {option.name}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Coin" />}
            />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <IconButton
              onClick={() => {
                if (toMode === "coin" && toCoin) {
                  const prevFrom = fromCoin;
                  setFromCoin(toCoin);
                  setToCoin(prevFrom);
                }
              }}
              disabled={toMode !== "coin" || !toCoin}
            >
              <SwapVertRoundedIcon />
            </IconButton>
          </Box>

          <Divider />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            Converted amount
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <TextField
              value={result ? result.toLocaleString(undefined, { maximumFractionDigits: 8 }) : "0"}
              fullWidth
              slotProps={{ input: { readOnly: true } }}
            />
            {toMode === "fiat" ? (
              <Autocomplete
                sx={{ width: 220 }}
                options={VS_CURRENCIES.filter((c) => c !== "btc" && c !== "eth")}
                value={toCurrency}
                getOptionLabel={(o) => o.toUpperCase()}
                onChange={(_e, v) => v && setToCurrency(v)}
                renderInput={(params) => <TextField {...params} label="Currency" />}
              />
            ) : (
              <Autocomplete
                sx={{ width: 220 }}
                options={toSearch.options}
                value={toCoin}
                getOptionLabel={(o) => o.symbol.toUpperCase()}
                onInputChange={(_e, v) => toSearch.setQuery(v)}
                onChange={(_e, v) => setToCoin(v)}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                    <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} /> {option.name}
                  </Box>
                )}
                renderInput={(params) => <TextField {...params} label="Coin" />}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Typography
              variant="caption"
              onClick={() => setToMode("fiat")}
              sx={{ cursor: "pointer", fontWeight: toMode === "fiat" ? 700 : 400, textDecoration: toMode === "fiat" ? "underline" : "none" }}
            >
              Convert to currency
            </Typography>
            <Typography
              variant="caption"
              onClick={() => setToMode("coin")}
              sx={{ cursor: "pointer", fontWeight: toMode === "coin" ? 700 : 400, textDecoration: toMode === "coin" ? "underline" : "none" }}
            >
              Convert to another coin
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
