import type { Metadata } from "next";
import LegalPage from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer — CryptoTracker",
  description: "Important disclaimer regarding the use of CryptoTracker.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      updatedAt="July 2026"
      sections={[
        {
          heading: "Not Financial Advice",
          body: "Cryptocurrency markets are highly volatile and speculative. Nothing on CryptoTracker should be interpreted as investment, financial, legal or tax advice. Always do your own research and consult a qualified professional before making financial decisions.",
        },
        {
          heading: "Risk of Loss",
          body: "Investing in cryptocurrencies carries significant risk, including the potential loss of your entire investment. Past performance is not indicative of future results.",
        },
        {
          heading: "Third-Party Data",
          body: "Price, market cap, volume and news data displayed on CryptoTracker is sourced from third-party providers (CoinGecko, Binance, CryptoCompare) and may contain errors or delays.",
        },
      ]}
    />
  );
}
