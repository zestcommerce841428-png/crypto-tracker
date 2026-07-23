import type { Metadata } from "next";
import LegalPage from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — CryptoTracker",
  description: "Terms governing your use of CryptoTracker.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updatedAt="July 2026"
      sections={[
        {
          heading: "Acceptance of Terms",
          body: "By accessing or using CryptoTracker, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.",
        },
        {
          heading: "No Financial Advice",
          body: "CryptoTracker provides market data and tools for informational purposes only. Nothing on this site constitutes financial, investment, legal or tax advice.",
        },
        {
          heading: "Data Accuracy",
          body: "While we strive for accuracy, price and market data is sourced from third parties and may be delayed, incomplete or incorrect. We make no warranties about the accuracy or reliability of this data.",
        },
        {
          heading: "Acceptable Use",
          body: "You agree not to misuse the service, including attempting to overload our infrastructure, scrape data at excessive rates, or use the site for unlawful purposes.",
        },
        {
          heading: "Limitation of Liability",
          body: "CryptoTracker and its operators are not liable for any losses arising from decisions made based on information provided on this site.",
        },
      ]}
    />
  );
}
