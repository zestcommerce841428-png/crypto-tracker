"use client";

import Box from "@mui/material/Box";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import { formatPercent } from "@/lib/utils/format";
import { useGainLossColors } from "@/lib/hooks/useGainLossColors";

export default function PriceChangeChip({
  value,
  variant = "text",
}: {
  value: number | null | undefined;
  variant?: "text" | "filled";
}) {
  const { gain, loss } = useGainLossColors();

  if (value === null || value === undefined || Number.isNaN(value)) {
    return <span>—</span>;
  }
  const isPositive = value >= 0;
  const color = isPositive ? gain : loss;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        fontWeight: 600,
        fontVariantNumeric: "tabular-nums",
        color: variant === "text" ? color : "#fff",
        bgcolor: variant === "filled" ? color : "transparent",
        px: variant === "filled" ? 0.9 : 0,
        py: variant === "filled" ? 0.2 : 0,
        borderRadius: variant === "filled" ? 1 : 0,
      }}
    >
      {isPositive ? (
        <ArrowDropUpRoundedIcon fontSize="small" />
      ) : (
        <ArrowDropDownRoundedIcon fontSize="small" />
      )}
      {formatPercent(Math.abs(value)).replace("+", "")}
    </Box>
  );
}
