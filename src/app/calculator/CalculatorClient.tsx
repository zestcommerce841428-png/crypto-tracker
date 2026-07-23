"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import { formatCurrency } from "@/lib/utils/format";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CalculatorClient() {
  const [coin, setCoin] = React.useState<SearchCoin>({
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    thumb: "",
  });
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);
  const [investment, setInvestment] = React.useState("1000");
  const [buyPrice, setBuyPrice] = React.useState("");
  const [sellPrice, setSellPrice] = React.useState("");
  const [useLivePrice, setUseLivePrice] = React.useState(true);

  const { data } = useSWR<Array<{ id: string; current_price: number }>>(
    `/api/markets?ids=${coin.id}&per_page=5`,
    fetcher,
    { refreshInterval: 30000 }
  );
  const livePrice = data?.[0]?.current_price ?? 0;

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.coins ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const effectiveSellPrice = useLivePrice ? livePrice : Number(sellPrice || 0);
  const effectiveBuyPrice = Number(buyPrice || 0);
  const coinsAmount = effectiveBuyPrice > 0 ? Number(investment || 0) / effectiveBuyPrice : 0;
  const finalValue = coinsAmount * effectiveSellPrice;
  const profit = finalValue - Number(investment || 0);
  const profitPercent = Number(investment || 0) > 0 ? (profit / Number(investment || 0)) * 100 : 0;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Crypto Profit Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Estimate your profit or loss on a cryptocurrency investment.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Autocomplete
            options={options}
            value={coin}
            getOptionLabel={(o) => o.name}
            onInputChange={(_e, v) => setQuery(v)}
            onChange={(_e, v) => v && setCoin(v)}
            isOptionEqualToValue={(o, v) => o.id === v.id}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} /> {option.name}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Coin" />}
          />
          <TextField
            label="Investment amount (USD)"
            type="number"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
          />
          <TextField
            label="Buy price (USD)"
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            helperText={`Current ${coin.name} price: ${formatCurrency(livePrice, "usd")}`}
          />
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={useLivePrice ? "contained" : "outlined"}
              onClick={() => setUseLivePrice(true)}
            >
              Use live sell price
            </Button>
            <Button
              size="small"
              variant={!useLivePrice ? "contained" : "outlined"}
              onClick={() => setUseLivePrice(false)}
            >
              Custom sell price
            </Button>
          </Stack>
          {!useLivePrice && (
            <TextField
              label="Sell price (USD)"
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          )}

          <Divider />

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Coins purchased</Typography>
            <Typography sx={{ fontWeight: 600 }}>{coinsAmount.toFixed(8)}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">Final value</Typography>
            <Typography sx={{ fontWeight: 600 }}>{formatCurrency(finalValue, "usd")}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography color="text.secondary">Profit / Loss</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 700 }} color={profit >= 0 ? "success.main" : "error.main"}>
                {formatCurrency(profit, "usd")}
              </Typography>
              <PriceChangeChip value={profitPercent} variant="filled" />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
