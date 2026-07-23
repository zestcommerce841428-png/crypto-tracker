import type { Metadata } from "next";
import Container from "@mui/material/Container";
import ScreenerClient from "./ScreenerClient";

export const metadata: Metadata = {
  title: "Crypto Screener — Filter Coins by Price, Market Cap & Volume",
  description:
    "Filter and screen cryptocurrencies by price range, market cap, 24h volume and price change.",
  alternates: { canonical: "/screener" },
};

export default function ScreenerPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ScreenerClient />
    </Container>
  );
}
