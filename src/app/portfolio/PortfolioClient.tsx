"use client";

import * as React from "react";
import useSWR from "swr";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { PieChart } from "@mui/x-charts/PieChart";
import { usePortfolioStore } from "@/lib/store/usePortfolioStore";
import StatCard from "@/components/common/StatCard";
import PriceChangeChip from "@/components/common/PriceChangeChip";
import { formatCurrency } from "@/lib/utils/format";
import AddHoldingDialog from "./AddHoldingDialog";
import type { CoinMarket } from "@/lib/types/coin";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PortfolioClient() {
  const holdings = usePortfolioStore((s) => s.holdings);
  const removeHolding = usePortfolioStore((s) => s.removeHolding);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const ids = [...new Set(holdings.map((h) => h.coinId))];
  const query = new URLSearchParams({ vs_currency: "usd", per_page: "250", ids: ids.join(",") });

  const { data: prices } = useSWR<CoinMarket[]>(
    ids.length > 0 ? `/api/markets?${query.toString()}` : null,
    fetcher,
    { refreshInterval: 45000 }
  );

  const priceMap = new Map((prices ?? []).map((c) => [c.id, c]));

  const rows = holdings.map((h) => {
    const market = priceMap.get(h.coinId);
    const currentPrice = market?.current_price ?? 0;
    const currentValue = currentPrice * h.amount;
    const costBasis = h.buyPrice * h.amount;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return { ...h, currentPrice, currentValue, costBasis, pnl, pnlPercent, image24h: market?.price_change_percentage_24h };
  });

  const totalValue = rows.reduce((sum, r) => sum + r.currentValue, 0);
  const totalCost = rows.reduce((sum, r) => sum + r.costBasis, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const pieData = rows
    .filter((r) => r.currentValue > 0)
    .sort((a, b) => b.currentValue - a.currentValue)
    .slice(0, 8)
    .map((r, i) => ({ id: i, value: r.currentValue, label: r.symbol.toUpperCase() }));

  return (
    <Stack spacing={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Portfolio Tracker
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your holdings are stored privately in this browser only.
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Holding
        </Button>
      </Stack>

      {holdings.length === 0 ? (
        <Paper variant="outlined" sx={{ p: 6, textAlign: "center" }}>
          <AccountBalanceWalletRoundedIcon sx={{ fontSize: 48, color: "text.secondary" }} />
          <Typography variant="h6" sx={{ mt: 1 }}>
            No holdings yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your first coin to start tracking performance.
          </Typography>
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Add Holding
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Total Value" value={formatCurrency(totalValue, "usd")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Total Invested" value={formatCurrency(totalCost, "usd")} />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard
                label="Profit / Loss"
                value={formatCurrency(totalPnl, "usd")}
                sub={`${totalPnlPercent >= 0 ? "+" : ""}${totalPnlPercent.toFixed(2)}%`}
                subColor={totalPnl >= 0 ? "success.main" : "error.main"}
              />
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <StatCard label="Assets" value={String(holdings.length)} />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Allocation
                </Typography>
                {pieData.length > 0 && (
                  <PieChart
                    series={[{ data: pieData, innerRadius: 40 }]}
                    height={260}
                    slotProps={{ legend: { direction: "vertical", position: { vertical: "middle", horizontal: "end" } } }}
                  />
                )}
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset</TableCell>
                      <TableCell align="right">Holdings</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">P/L</TableCell>
                      <TableCell align="center" width={40} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.uid} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar src={row.image} sx={{ width: 22, height: 22 }} />
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {row.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right">{formatCurrency(row.currentPrice, "usd")}</TableCell>
                        <TableCell align="right">{formatCurrency(row.currentValue, "usd")}</TableCell>
                        <TableCell align="right">
                          <PriceChangeChip value={row.pnlPercent} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => removeHolding(row.uid)}>
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      <AddHoldingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Stack>
  );
}
