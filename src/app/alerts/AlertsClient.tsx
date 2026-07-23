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
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useAlertsStore } from "@/lib/store/useAlertsStore";
import { formatCurrency } from "@/lib/utils/format";

type SimplePriceResponse = Record<string, { usd: number; usd_24h_change?: number }>;

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AlertsClient() {
  const alerts = useAlertsStore((s) => s.alerts);
  const addAlert = useAlertsStore((s) => s.addAlert);
  const removeAlert = useAlertsStore((s) => s.removeAlert);
  const markTriggered = useAlertsStore((s) => s.markTriggered);

  const [coin, setCoin] = React.useState<SearchCoin | null>(null);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);
  const [targetPrice, setTargetPrice] = React.useState("");
  const [direction, setDirection] = React.useState<"above" | "below">("above");
  const [notifPermission, setNotifPermission] = React.useState<NotificationPermission>("default");

  React.useEffect(() => {
    if (typeof Notification !== "undefined") {
      setNotifPermission(Notification.permission);
    }
  }, []);

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.coins ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const ids = [...new Set(alerts.map((a) => a.coinId))];
  const { data: prices } = useSWR<SimplePriceResponse>(
    ids.length > 0 ? `/api/simple-price?ids=${ids.join(",")}` : null,
    fetcher,
    { refreshInterval: 30000 }
  );

  React.useEffect(() => {
    if (!prices) return;
    for (const alert of alerts) {
      if (alert.triggered) continue;
      const currentPrice = prices[alert.coinId]?.usd;
      if (currentPrice === undefined) continue;
      const hit =
        alert.direction === "above"
          ? currentPrice >= alert.targetPrice
          : currentPrice <= alert.targetPrice;
      if (hit) {
        markTriggered(alert.uid);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(`${alert.name} ${alert.direction === "above" ? "reached" : "dropped to"} ${formatCurrency(alert.targetPrice, "usd")}`);
        }
      }
    }
  }, [prices, alerts, markTriggered]);

  const requestPermission = async () => {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setNotifPermission(result);
  };

  const handleAdd = () => {
    if (!coin || !targetPrice) return;
    addAlert({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.thumb,
      targetPrice: Number(targetPrice),
      direction,
    });
    setCoin(null);
    setTargetPrice("");
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Price Alerts
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Get a browser notification when a coin hits your target price.
      </Typography>

      {notifPermission !== "granted" && (
        <Alert
          severity="info"
          action={
            <Button color="inherit" size="small" onClick={requestPermission}>
              Enable
            </Button>
          }
        >
          Enable browser notifications to get alerted.
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Autocomplete
            options={options}
            value={coin}
            getOptionLabel={(o) => o.name}
            onInputChange={(_e, v) => setQuery(v)}
            onChange={(_e, v) => setCoin(v)}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} /> {option.name}
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Coin" />}
          />
          <ToggleButtonGroup
            exclusive
            value={direction}
            onChange={(_e, v) => v && setDirection(v)}
            fullWidth
          >
            <ToggleButton value="above">Price goes above</ToggleButton>
            <ToggleButton value="below">Price goes below</ToggleButton>
          </ToggleButtonGroup>
          <TextField
            label="Target price (USD)"
            type="number"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd} disabled={!coin || !targetPrice}>
            Create Alert
          </Button>
        </Stack>
      </Paper>

      <Stack spacing={1}>
        {alerts.map((alert) => {
          const currentPrice = prices?.[alert.coinId]?.usd;
          return (
            <Paper key={alert.uid} variant="outlined" sx={{ p: 2 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar src={alert.image} sx={{ width: 28, height: 28 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {alert.name} {alert.direction} {formatCurrency(alert.targetPrice, "usd")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Current: {formatCurrency(currentPrice, "usd")}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {alert.triggered && <Chip label="Triggered" size="small" color="success" />}
                  <IconButton size="small" onClick={() => removeAlert(alert.uid)}>
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}
