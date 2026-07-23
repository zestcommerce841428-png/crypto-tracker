import type { Metadata } from "next";
import Container from "@mui/material/Container";
import MarketsClient from "./MarketsClient";

export const metadata: Metadata = {
  title: "Crypto Markets — Live Prices, Market Cap & Volume",
  description:
    "Browse live prices, market cap, 24h volume and price charts for thousands of cryptocurrencies. Filter by category: DeFi, NFT, Layer 1, Layer 2, meme coins and more.",
  alternates: { canonical: "/markets" },
};

export default function MarketsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <MarketsClient />
    </Container>
  );
}
