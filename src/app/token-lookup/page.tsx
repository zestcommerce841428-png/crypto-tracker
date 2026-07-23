import type { Metadata } from "next";
import Container from "@mui/material/Container";
import TokenLookupClient from "./TokenLookupClient";

export const metadata: Metadata = {
  title: "Token Lookup by Contract Address — Any EVM Chain or Solana",
  description:
    "Look up any token's live price, market cap and volume by pasting its contract address, across Ethereum, BNB Chain, Polygon, Arbitrum, Optimism, Avalanche, Base and Solana.",
  alternates: { canonical: "/token-lookup" },
};

export default function TokenLookupPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <TokenLookupClient />
    </Container>
  );
}
