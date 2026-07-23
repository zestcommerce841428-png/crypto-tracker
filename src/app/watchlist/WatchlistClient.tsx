"use client";

import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";
import type { CoinMarket } from "@/lib/types/coin";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WatchlistClient() {
  const coinIds = useWatchlistStore((s) => s.coinIds);
  const vsCurrency = useSettingsStore((s) => s.vsCurrency);

  const query = new URLSearchParams({
    vs_currency: vsCurrency,
    per_page: "250",
    ids: coinIds.join(","),
  });

  const { data, isLoading } = useSWR<CoinMarket[]>(
    coinIds.length > 0 ? `/api/markets?${query.toString()}` : null,
    fetcher,
    { refreshInterval: 45000 }
  );

  return (
    <Stack spacing={2}>
      <Stack spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          My Watchlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coins you&apos;re tracking, stored locally in your browser.
        </Typography>
      </Stack>

      {coinIds.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <StarBorderRoundedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            Your watchlist is empty
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Star any coin from the markets page to add it here.
          </Typography>
          <Button component={Link} href="/markets" variant="contained">
            Browse markets
          </Button>
        </Paper>
      ) : (
        <Box>
          <CoinMarketsTable coins={data ?? []} vsCurrency={vsCurrency} isLoading={isLoading} />
        </Box>
      )}
    </Stack>
  );
}
