import type { Metadata } from "next";
import Container from "@mui/material/Container";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "Crypto Profit Calculator — Estimate Gains & Losses",
  description:
    "Calculate potential profit or loss on a cryptocurrency investment based on buy price, sell price and amount invested.",
  alternates: { canonical: "/calculator" },
};

export default function CalculatorPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <CalculatorClient />
    </Container>
  );
}
