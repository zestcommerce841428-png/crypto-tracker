"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import SimpleAreaChart from "@/components/charts/SimpleAreaChart";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

interface HistoryResult {
  name: string;
  image?: { small: string };
  market_data?: {
    current_price?: Record<string, number>;
    market_cap?: Record<string, number>;
    total_volume?: Record<string, number>;
  };
}

function toApiDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export default function HistoricalDataClient() {
  const [coin, setCoin] = React.useState<SearchCoin>({
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "btc",
    thumb: "",
  });
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);
  const [date, setDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 365);
    return d.toISOString().slice(0, 10);
  });
  const [result, setResult] = React.useState<HistoryResult | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [rangeFrom, setRangeFrom] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().slice(0, 10);
  });
  const [rangeTo, setRangeTo] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [rangeSeries, setRangeSeries] = React.useState<{ time: number; value: number }[]>([]);
  const [rangeLoading, setRangeLoading] = React.useState(false);
  const [rangeError, setRangeError] = React.useState("");

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.coins ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleLookup = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/coin/${coin.id}/history?date=${toApiDate(date)}`);
      const data = await res.json();
      if (data.error || !data.market_data) {
        setError("No data found for that date.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to fetch historical data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRangeLookup = async () => {
    setRangeLoading(true);
    setRangeError("");
    setRangeSeries([]);
    try {
      const fromTs = Math.floor(new Date(rangeFrom).getTime() / 1000);
      const toTs = Math.floor(new Date(rangeTo).getTime() / 1000);
      const res = await fetch(`/api/coin/${coin.id}/chart-range?vs_currency=usd&from=${fromTs}&to=${toTs}`);
      const data = await res.json();
      if (data.error || !data.prices?.length) {
        setRangeError("No data found for that date range.");
      } else {
        setRangeSeries(data.prices.map(([time, value]: [number, number]) => ({ time, value })));
      }
    } catch {
      setRangeError("Failed to fetch chart range.");
    } finally {
      setRangeLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Historical Crypto Prices
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Look up any coin&apos;s price on a specific past date, or chart a custom date range.
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
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button variant="contained" onClick={handleLookup} loading={loading}>
            Look up price
          </Button>

          {error && <Alert severity="warning">{error}</Alert>}

          {result && (
            <>
              <Divider />
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Price (USD)</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCurrency(result.market_data?.current_price?.usd, "usd")}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Market Cap</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCompactNumber(result.market_data?.market_cap?.usd, "usd")}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">24h Volume</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatCompactNumber(result.market_data?.total_volume?.usd, "usd")}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>

      <Typography variant="h5" sx={{ fontWeight: 800, mt: 2 }}>
        Custom Date Range Chart
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Chart {coin.name}&apos;s price across any custom start and end date.
      </Typography>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="From"
              type="date"
              value={rangeFrom}
              onChange={(e) => setRangeFrom(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="To"
              type="date"
              value={rangeTo}
              onChange={(e) => setRangeTo(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>
          <Button variant="contained" onClick={handleRangeLookup} loading={rangeLoading}>
            Chart this range
          </Button>
          {rangeError && <Alert severity="warning">{rangeError}</Alert>}
          {rangeSeries.length > 1 && <SimpleAreaChart data={rangeSeries} valueSuffix=" USD" height={300} />}
        </Stack>
      </Paper>
    </Stack>
  );
}
