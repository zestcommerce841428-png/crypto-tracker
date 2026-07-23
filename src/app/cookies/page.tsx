import type { Metadata } from "next";
import LegalPage from "@/components/common/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — CryptoTracker",
  description: "How CryptoTracker uses local storage and cookies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updatedAt="July 2026"
      sections={[
        {
          heading: "No Tracking Cookies",
          body: "CryptoTracker does not use advertising or tracking cookies.",
        },
        {
          heading: "Local Storage",
          body: "We use your browser's local storage to remember your theme preference, currency selection, watchlist, portfolio holdings and price alerts. This data stays on your device and is never sent to our servers.",
        },
        {
          heading: "Managing Local Storage",
          body: "You can clear this data at any time by clearing your browser's site data for CryptoTracker, which will reset your preferences, watchlist and portfolio.",
        },
      ]}
    />
  );
}
