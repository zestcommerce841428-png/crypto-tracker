"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMoreRounded";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoinRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ThemeToggle from "@/components/common/ThemeToggle";
import CurrencySelector from "@/components/common/CurrencySelector";
import SearchBar from "@/components/common/SearchBar";
import AccessibilityPanel from "@/components/common/AccessibilityPanel";
import { primaryNav, exploreNavGroups } from "@/lib/nav";

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [exploreAnchor, setExploreAnchor] = React.useState<null | HTMLElement>(null);

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider", backdropFilter: "blur(8px)" }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <CurrencyBitcoinIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 800 }} noWrap>
            CryptoTracker
          </Typography>
        </Link>

        {!isMobile && (
          <Stack direction="row" spacing={0.5} sx={{ ml: 2 }}>
            {primaryNav.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color={pathname === item.href ? "primary" : "inherit"}
                sx={{ fontWeight: pathname === item.href ? 700 : 500 }}
              >
                {item.label}
              </Button>
            ))}
            <Button
              color="inherit"
              endIcon={<ExpandMoreIcon />}
              onClick={(e) => setExploreAnchor(e.currentTarget)}
            >
              Explore
            </Button>
            <Menu
              anchorEl={exploreAnchor}
              open={Boolean(exploreAnchor)}
              onClose={() => setExploreAnchor(null)}
            >
              {exploreNavGroups.map((group, i) => [
                <Typography
                  key={`${group.label}-title`}
                  variant="overline"
                  color="text.secondary"
                  sx={{ px: 2, pt: i > 0 ? 1 : 0 }}
                  display="block"
                >
                  {group.label}
                </Typography>,
                ...group.items.map((item) => (
                  <MenuItem
                    key={item.href}
                    component={Link}
                    href={item.href}
                    onClick={() => setExploreAnchor(null)}
                  >
                    <ListItemText primary={item.label} secondary={item.description} />
                  </MenuItem>
                )),
                i < exploreNavGroups.length - 1 && <Divider key={`${group.label}-divider`} />,
              ])}
            </Menu>
          </Stack>
        )}

        <Box sx={{ flex: 1 }} />

        {!isMobile && <SearchBar />}
        <CurrencySelector />
        <ThemeToggle />
        <AccessibilityPanel />

        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open menu" color="inherit">
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }} role="presentation">
          <Box sx={{ mb: 2 }}>
            <SearchBar fullWidth />
          </Box>
          <Stack spacing={0.5}>
            {primaryNav.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                fullWidth
                sx={{ justifyContent: "flex-start" }}
                color={pathname === item.href ? "primary" : "inherit"}
              >
                {item.label}
              </Button>
            ))}
            <Divider sx={{ my: 1 }} />
            {exploreNavGroups.flatMap((group) => group.items).map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                fullWidth
                sx={{ justifyContent: "flex-start" }}
                color="inherit"
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
