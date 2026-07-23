import type { Metadata } from "next";
import Container from "@mui/material/Container";
import ConverterClient from "./ConverterClient";

export const metadata: Metadata = {
  title: "Crypto Converter — Convert Between Coins & Currencies",
  description:
    "Instantly convert between any two cryptocurrencies or fiat currencies using live exchange rates.",
  alternates: { canonical: "/converter" },
};

export default function ConverterPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <ConverterClient />
    </Container>
  );
}
