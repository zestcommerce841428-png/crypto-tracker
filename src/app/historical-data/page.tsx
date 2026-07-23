import type { Metadata } from "next";
import Container from "@mui/material/Container";
import HistoricalDataClient from "./HistoricalDataClient";

export const metadata: Metadata = {
  title: "Historical Crypto Prices — Look Up Any Past Date",
  description: "Look up the historical price, market cap and volume of any cryptocurrency on a specific past date.",
  alternates: { canonical: "/historical-data" },
};

export default function HistoricalDataPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <HistoricalDataClient />
    </Container>
  );
}
