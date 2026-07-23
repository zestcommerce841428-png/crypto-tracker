"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import { useMarkets } from "@/lib/hooks/useMarkets";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";
import CoinGridView from "@/components/coin/CoinGridView";
import BinanceLiveMarketsTable from "@/components/coin/BinanceLiveMarketsTable";

const CATEGORY_TABS = [
  { label: "All Coins", value: "" },
  { label: "DeFi", value: "decentralized-finance-defi" },
  { label: "NFT", value: "non-fungible-tokens-nft" },
  { label: "Layer 1", value: "layer-1" },
  { label: "Layer 2", value: "layer-2" },
  { label: "Meme", value: "meme-token" },
  { label: "Gaming", value: "gaming" },
  { label: "AI", value: "artificial-intelligence" },
  { label: "Stablecoins", value: "stablecoins" },
];

const BINANCE_SORTS = [
  { label: "Top Volume", value: "volume" as const },
  { label: "Top Gainers", value: "gainers" as const },
  { label: "Top Losers", value: "losers" as const },
];

const PER_PAGE = 100;
// CoinGecko's /coins/markets endpoint reliably serves ranked data across its
// full tracked universe (~17,000+ coins); 175 pages * 100/page covers it.
const MAX_PAGES = 175;
const VIEW_STORAGE_KEY = "crypto-tracker-markets-view";

export default function MarketsClient() {
  const vsCurrency = useSettingsStore((s) => s.vsCurrency);
  const [category, setCategory] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [view, setView] = React.useState<"table" | "grid">("table");
  const [source, setSource] = React.useState<"ranked" | "live">("ranked");
  const [binanceSort, setBinanceSort] = React.useState<"volume" | "gainers" | "losers">("volume");

  React.useEffect(() => {
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "table" || stored === "grid") setView(stored);
  }, []);

  const handleViewChange = (next: "table" | "grid") => {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  };

  const { coins, isLoading, error } = useMarkets({
    vsCurrency,
    page,
    perPage: PER_PAGE,
    category: category || undefined,
  });

  return (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" useFlexGap>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Cryptocurrency Prices by Market Cap
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {source === "ranked"
              ? "Ranked by market cap (CoinGecko), refreshed every 45 seconds."
              : "Live from Binance — every USDT pair, refreshed every 10 seconds, no rate limits."}
          </Typography>
        </Stack>
        {source === "ranked" && (
          <ToggleButtonGroup size="small" exclusive value={view} onChange={(_e, v) => v && handleViewChange(v)}>
            <ToggleButton value="table" aria-label="Table view">
              <ViewListRoundedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="grid" aria-label="Grid view">
              <GridViewRoundedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>

      <ToggleButtonGroup
        size="small"
        exclusive
        value={source}
        onChange={(_e, v) => v && setSource(v)}
        color="primary"
      >
        <ToggleButton value="ranked">Ranked (CoinGecko)</ToggleButton>
        <ToggleButton value="live">
          <BoltRoundedIcon fontSize="small" sx={{ mr: 0.5 }} />
          Live (Binance)
        </ToggleButton>
      </ToggleButtonGroup>

      {source === "ranked" ? (
        <>
          <Tabs
            value={category}
            onChange={(_e, value) => {
              setCategory(value);
              setPage(1);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {CATEGORY_TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} value={tab.value} />
            ))}
          </Tabs>

          {error && <Alert severity="error">Failed to load market data. Retrying…</Alert>}

          {view === "table" ? (
            <CoinMarketsTable
              coins={coins}
              vsCurrency={vsCurrency}
              isLoading={isLoading}
              rankOffset={(page - 1) * PER_PAGE}
            />
          ) : (
            <CoinGridView coins={coins} vsCurrency={vsCurrency} isLoading={isLoading} />
          )}

          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <Pagination
              count={MAX_PAGES}
              page={page}
              onChange={(_e, value) => setPage(value)}
              color="primary"
              siblingCount={1}
              boundaryCount={1}
            />
          </Box>
        </>
      ) : (
        <>
          <Tabs value={binanceSort} onChange={(_e, v) => setBinanceSort(v)}>
            {BINANCE_SORTS.map((s) => (
              <Tab key={s.value} label={s.label} value={s.value} />
            ))}
          </Tabs>
          <BinanceLiveMarketsTable sort={binanceSort} />
        </>
      )}
    </Stack>
  );
}
