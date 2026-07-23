import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SitemapLinks from "./SitemapLinks";

export const metadata: Metadata = {
  title: "Sitemap — CryptoTracker",
  description: "Browse all pages available on CryptoTracker.",
  alternates: { canonical: "/sitemap-page" },
};

export default function SitemapPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        Sitemap
      </Typography>
      <SitemapLinks />
    </Container>
  );
}
