import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CompareClient from "./CompareClient";
import LinkCard from "@/components/common/LinkCard";
import { FEATURED_COMPARE_PAIRS, POPULAR_COINS } from "@/lib/data/popularCoins";

export const metadata: Metadata = {
  title: "Compare Cryptocurrencies — Side-by-Side Price & Stats",
  description:
    "Compare up to 4 cryptocurrencies side by side: price, market cap, volume, supply and performance.",
  alternates: { canonical: "/compare" },
};

function nameFor(id: string) {
  return POPULAR_COINS.find((c) => c.id === id)?.name ?? id;
}

export default function ComparePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <CompareClient />

      <Stack spacing={0.5} sx={{ mt: 5, mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Popular Comparisons
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quick links to detailed, shareable comparison pages.
        </Typography>
      </Stack>
      <Grid container spacing={1.5}>
        {FEATURED_COMPARE_PAIRS.map(([a, b]) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={`${a}-vs-${b}`}>
            <LinkCard href={`/compare/${a}-vs-${b}`} sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {nameFor(a)} vs {nameFor(b)}
              </Typography>
            </LinkCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
