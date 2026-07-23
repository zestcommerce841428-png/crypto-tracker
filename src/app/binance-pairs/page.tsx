import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import BinancePairsClient from "./BinancePairsClient";

export const metadata: Metadata = {
  title: "Binance Trading Pairs — Live Spot Market Explorer",
  description:
    "Browse every live spot trading pair on Binance, searchable by base or quote asset — sourced directly from Binance's public exchange info API.",
  alternates: { canonical: "/binance-pairs" },
};

export default function BinancePairsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Binance Trading Pairs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Every live spot trading pair on Binance, searchable by base or quote asset.
        </Typography>
      </Stack>
      <BinancePairsClient />
    </Container>
  );
}
