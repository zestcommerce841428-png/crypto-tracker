"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";

const items = [
  { label: "Home", href: "/dashboard", icon: <HomeRoundedIcon /> },
  { label: "Markets", href: "/markets", icon: <BarChartRoundedIcon /> },
  { label: "Watchlist", href: "/watchlist", icon: <StarRoundedIcon /> },
  { label: "Portfolio", href: "/portfolio", icon: <AccountBalanceWalletRoundedIcon /> },
  { label: "News", href: "/news", icon: <NewspaperRoundedIcon /> },
];

export default function MobileBottomNav() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const router = useRouter();

  if (!isMobile) return null;

  const currentIndex = Math.max(
    0,
    items.findIndex((item) => item.href === pathname)
  );

  return (
    <Paper
      elevation={3}
      sx={{ position: "sticky", bottom: 0, zIndex: 10, borderTop: 1, borderColor: "divider" }}
    >
      <BottomNavigation
        showLabels
        value={currentIndex}
        onChange={(_e, newValue) => router.push(items[newValue].href)}
      >
        {items.map((item) => (
          <BottomNavigationAction key={item.href} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
