"use client";

import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import { usePortfolioStore } from "@/lib/store/usePortfolioStore";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export default function AddHoldingDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const addHolding = usePortfolioStore((s) => s.addHolding);
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);
  const [selected, setSelected] = React.useState<SearchCoin | null>(null);
  const [amount, setAmount] = React.useState("");
  const [buyPrice, setBuyPrice] = React.useState("");
  const [buyDate, setBuyDate] = React.useState(() => new Date().toISOString().slice(0, 10));

  React.useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setOptions(data.coins ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = () => {
    if (!selected || !amount || !buyPrice) return;
    addHolding({
      coinId: selected.id,
      symbol: selected.symbol,
      name: selected.name,
      image: selected.thumb,
      amount: Number(amount),
      buyPrice: Number(buyPrice),
      buyCurrency: "usd",
      buyDate,
    });
    setSelected(null);
    setAmount("");
    setBuyPrice("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add Holding</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={options}
            getOptionLabel={(o) => o.name}
            value={selected}
            onChange={(_e, value) => setSelected(value)}
            onInputChange={(_e, value) => setQuery(value)}
            renderOption={(props, option) => (
              <Box component="li" {...props} key={option.id} sx={{ gap: 1 }}>
                <Avatar src={option.thumb} sx={{ width: 20, height: 20 }} />
                {option.name} ({option.symbol?.toUpperCase()})
              </Box>
            )}
            renderInput={(params) => <TextField {...params} label="Coin" autoFocus />}
          />
          <TextField
            label="Amount held"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <TextField
            label="Buy price (USD)"
            type="number"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Purchase date"
            type="date"
            value={buyDate}
            onChange={(e) => setBuyDate(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!selected || !amount || !buyPrice}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
