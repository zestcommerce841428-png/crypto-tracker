import type { Metadata } from "next";
import Container from "@mui/material/Container";
import AlertsClient from "./AlertsClient";

export const metadata: Metadata = {
  title: "Price Alerts — Get Notified on Price Targets",
  description: "Set custom cryptocurrency price alerts and get a browser notification when your target is hit.",
  alternates: { canonical: "/alerts" },
  robots: { index: false, follow: true },
};

export default function AlertsPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <AlertsClient />
    </Container>
  );
}
