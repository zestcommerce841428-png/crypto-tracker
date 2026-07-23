import type { Metadata } from "next";
import LegalPage from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — CryptoTracker",
  description: "How CryptoTracker handles your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updatedAt="July 2026"
      sections={[
        {
          heading: "Local-First Data",
          body: "Your watchlist, portfolio holdings, price alerts and theme preference are stored entirely in your browser's local storage. This data is never transmitted to or stored on our servers.",
        },
        {
          heading: "Market Data Requests",
          body: "To display prices and charts, your browser makes requests to our server, which in turn fetches data from CoinGecko and Binance public APIs. These requests do not include any personal or portfolio information.",
        },
        {
          heading: "Cookies",
          body: "We do not use tracking cookies. Local storage is used solely for storing your preferences and portfolio data on your own device.",
        },
        {
          heading: "Third-Party Data Providers",
          body: "Market data is provided by CoinGecko and Binance. News content is provided by CryptoCompare. Please refer to their respective privacy policies for information about their data practices.",
        },
        {
          heading: "Changes to This Policy",
          body: "We may update this policy from time to time. Continued use of CryptoTracker after changes constitutes acceptance of the updated policy.",
        },
      ]}
    />
  );
}
