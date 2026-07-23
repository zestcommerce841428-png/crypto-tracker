import type { Metadata } from "next";
import Container from "@mui/material/Container";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio Tracker — Track Your Crypto Holdings & P/L",
  description:
    "Track your cryptocurrency portfolio's value, profit/loss and allocation in real time. Your data stays private in your browser.",
  alternates: { canonical: "/portfolio" },
  robots: { index: false, follow: true },
};

export default function PortfolioPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PortfolioClient />
    </Container>
  );
}
