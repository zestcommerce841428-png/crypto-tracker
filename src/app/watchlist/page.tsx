import type { Metadata } from "next";
import Container from "@mui/material/Container";
import WatchlistClient from "./WatchlistClient";

export const metadata: Metadata = {
  title: "My Watchlist — Track Your Favorite Coins",
  description: "Keep track of the cryptocurrencies you care about with live prices and charts.",
  alternates: { canonical: "/watchlist" },
  robots: { index: false, follow: true },
};

export default function WatchlistPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <WatchlistClient />
    </Container>
  );
}
