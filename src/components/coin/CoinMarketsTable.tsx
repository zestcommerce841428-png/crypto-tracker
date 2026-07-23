"use client";

import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CoinIcon from "@/components/common/CoinIcon";
import IconButton from "@mui/material/IconButton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import Skeleton from "@mui/material/Skeleton";
import type { CoinMarket } from "@/lib/types/coin";
import { formatCurrency, formatCompactNumber } from "@/lib/utils/format";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import Sparkline from "@/components/charts/Sparkline";
import { useWatchlistStore } from "@/lib/store/useWatchlistStore";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface Props {
  coins: CoinMarket[];
  vsCurrency?: string;
  isLoading?: boolean;
  showRank?: boolean;
  showSparkline?: boolean;
  rankOffset?: number;
}

export default function CoinMarketsTable({
  coins,
  vsCurrency = "usd",
  isLoading = false,
  showRank = true,
  showSparkline = true,
  rankOffset = 0,
}: Props) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const watched = useWatchlistStore((s) => s.coinIds);
  const toggleWatch = useWatchlistStore((s) => s.toggle);

  if (isLoading) {
    return (
      <Paper variant="outlined">
        {Array.from({ length: 10 }).map((_, i) => (
          <Box key={i} sx={{ p: 1.5 }}>
            <Skeleton height={40} />
          </Box>
        ))}
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" sx={{ minWidth: 640 }}>
        <TableHead>
          <TableRow>
            <TableCell width={40} />
            {showRank && <TableCell>#</TableCell>}
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">1h%</TableCell>
            <TableCell align="right">24h%</TableCell>
            {!isTablet && <TableCell align="right">7d%</TableCell>}
            {!isMobile && <TableCell align="right">Market Cap</TableCell>}
            {!isMobile && <TableCell align="right">Volume (24h)</TableCell>}
            {showSparkline && !isTablet && <TableCell align="right">7d Chart</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin, idx) => (
            <TableRow
              key={coin.id}
              hover
              onClick={() => router.push(`/coin/${coin.id}`)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell onClick={(e) => e.stopPropagation()}>
                <IconButton
                  size="small"
                  onClick={() => toggleWatch(coin.id)}
                  aria-label="Toggle watchlist"
                >
                  {watched.includes(coin.id) ? (
                    <StarRoundedIcon fontSize="small" color="warning" />
                  ) : (
                    <StarBorderRoundedIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
              {showRank && (
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {rankOffset + idx + 1}
                  </Typography>
                </TableCell>
              )}
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CoinIcon src={coin.image} alt={coin.name} size={24} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {coin.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {coin.symbol?.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                  {formatCurrency(coin.current_price, vsCurrency)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <PriceChangeChip value={coin.price_change_percentage_1h_in_currency} />
              </TableCell>
              <TableCell align="right">
                <PriceChangeChip value={coin.price_change_percentage_24h_in_currency ?? coin.price_change_percentage_24h} />
              </TableCell>
              {!isTablet && (
                <TableCell align="right">
                  <PriceChangeChip value={coin.price_change_percentage_7d_in_currency} />
                </TableCell>
              )}
              {!isMobile && (
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCompactNumber(coin.market_cap, vsCurrency)}
                  </Typography>
                </TableCell>
              )}
              {!isMobile && (
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatCompactNumber(coin.total_volume, vsCurrency)}
                  </Typography>
                </TableCell>
              )}
              {showSparkline && !isTablet && (
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Sparkline data={coin.sparkline_in_7d?.price ?? []} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
