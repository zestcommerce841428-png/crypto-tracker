"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import { CONTRACT_PLATFORMS } from "@/lib/data/popularCoins";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";

interface TokenResult {
  id: string;
  name: string;
  symbol: string;
  image: { large: string };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
  };
}

export default function TokenLookupClient() {
  const [platform, setPlatform] = React.useState("ethereum");
  const [address, setAddress] = React.useState("");
  const [result, setResult] = React.useState<TokenResult | null>(null);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLookup = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(
        `/api/token?platform=${platform}&address=${encodeURIComponent(address.trim())}`
      );
      if (!res.ok) {
        setError("No token found for that contract address on the selected chain.");
        return;
      }
      setResult(await res.json());
    } catch {
      setError("Failed to look up token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Token Lookup by Contract Address
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Paste any token&apos;s contract address to find its live price, market cap and volume.
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Select size="small" value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {CONTRACT_PLATFORMS.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Contract address"
            placeholder="0x..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleLookup} loading={loading}>
            Look up token
          </Button>

          {error && <Alert severity="warning">{error}</Alert>}

          {result && (
            <>
              <Divider />
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Avatar src={result.image?.large} sx={{ width: 40, height: 40 }} />
                <Stack>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {result.name} ({result.symbol?.toUpperCase()})
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">
                      {formatCurrency(result.market_data?.current_price?.usd, "usd")}
                    </Typography>
                    <PriceChangeChip value={result.market_data?.price_change_percentage_24h} />
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCompactNumber(result.market_data?.market_cap?.usd, "usd")}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">24h Volume</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatCompactNumber(result.market_data?.total_volume?.usd, "usd")}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
