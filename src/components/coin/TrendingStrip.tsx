"use client";

import Link from "next/link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import CoinIcon from "@/components/common/CoinIcon";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import type { TrendingCoin } from "@/lib/types/coin";

export default function TrendingStrip({ coins }: { coins: TrendingCoin[] }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <LocalFireDepartmentRoundedIcon color="error" fontSize="small" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Trending
        </Typography>
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{ overflowX: "auto", pb: 1 }}
      >
        {coins.slice(0, 10).map((entry, i) => (
          <Box
            key={entry.item.id}
            component={Link}
            href={`/coin/${entry.item.id}`}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              minWidth: 150,
              p: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ width: 16 }}>
              {i + 1}
            </Typography>
            <CoinIcon src={entry.item.small} alt={entry.item.name} size={26} />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                {entry.item.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {entry.item.symbol?.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
