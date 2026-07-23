"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { footerNavGroups } from "@/lib/nav";

export default function Footer() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", mt: 8, py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }} gutterBottom>
              CryptoTracker
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 320 }}>
              Real-time cryptocurrency prices, charts, portfolio tracking and market
              analytics powered by CoinGecko and Binance public data.
            </Typography>
          </Grid>
          {footerNavGroups.map((group) => (
            <Grid size={{ xs: 6, sm: 2 }} key={group.label}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }} gutterBottom>
                {group.label}
              </Typography>
              <Stack spacing={0.75}>
                {group.items.map((item) => (
                  <Typography
                    key={item.href}
                    component={Link}
                    href={item.href}
                    variant="body2"
                    color="text.secondary"
                    sx={{ "&:hover": { color: "text.primary" } }}
                  >
                    {item.label}
                  </Typography>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} CryptoTracker. Market data by CoinGecko & Binance.
            Not financial advice.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
