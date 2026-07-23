"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/SearchRounded";
import InputAdornment from "@mui/material/InputAdornment";

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
}

export default function SearchBar({ fullWidth = false }: { fullWidth?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [options, setOptions] = React.useState<SearchCoin[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (query.trim().length < 2) {
      setOptions([]);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setOptions(data.coins ?? []);
      } catch {
        // ignore aborted/failed requests
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <Autocomplete
      sx={{ width: fullWidth ? "100%" : 320 }}
      size="small"
      options={options}
      loading={loading}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.name}
      onInputChange={(_e, value) => setQuery(value)}
      onChange={(_e, value) => {
        if (value) router.push(`/coin/${value.id}`);
      }}
      noOptionsText={query.length < 2 ? "Type to search coins…" : "No coins found"}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.id} sx={{ gap: 1.25 }}>
          <Avatar src={option.thumb} sx={{ width: 22, height: 22 }} />
          <Typography variant="body2" sx={{ flex: 1 }}>
            {option.name}{" "}
            <Typography component="span" variant="caption" color="text.secondary">
              {option.symbol?.toUpperCase()}
            </Typography>
          </Typography>
          {option.market_cap_rank && (
            <Typography variant="caption" color="text.secondary">
              #{option.market_cap_rank}
            </Typography>
          )}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search coins…"
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
