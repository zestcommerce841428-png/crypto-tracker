import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AllCoinsClient from "./AllCoinsClient";

export const metadata: Metadata = {
  title: "All Cryptocurrencies — Full A-Z Coin Directory",
  description:
    "Browse and search the complete list of cryptocurrencies tracked by CoinGecko — thousands of coins, alphabetically indexed.",
  alternates: { canonical: "/all-coins" },
};

export default function AllCoinsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          All Cryptocurrencies
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Search or browse the complete list of coins tracked by CoinGecko, alphabetically.
        </Typography>
      </Stack>
      <AllCoinsClient />
    </Container>
  );
}
