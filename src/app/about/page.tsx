import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

export const metadata: Metadata = {
  title: "About CryptoTracker",
  description: "Learn about CryptoTracker, a fast and free platform for tracking cryptocurrency prices, portfolios and market data.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Real-Time Data", body: "Live prices and market data sourced from CoinGecko and Binance public APIs." },
  { title: "Privacy First", body: "Your portfolio and watchlist data stays in your browser — we never see it." },
  { title: "Always Free", body: "Every feature on CryptoTracker is free to use, with no account required." },
  { title: "Built for Speed", body: "Powered by Next.js with server-side caching for a fast, responsive experience." },
];

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            About CryptoTracker
          </Typography>
          <Typography variant="body1" color="text.secondary">
            CryptoTracker is a free, fast, and privacy-conscious platform for tracking
            cryptocurrency prices, portfolios, and market trends.
          </Typography>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          We built CryptoTracker to give anyone — from casual holders to active traders — a
          single place to check live prices, follow market trends, manage a personal portfolio,
          and research coins in depth, without ads getting in the way or accounts being required.
          All market data is sourced from CoinGecko and Binance&apos;s public APIs and refreshed
          continuously.
        </Typography>

        <Grid container spacing={2}>
          {values.map((v) => (
            <Grid size={{ xs: 12, sm: 6 }} key={v.title}>
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {v.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {v.body}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
