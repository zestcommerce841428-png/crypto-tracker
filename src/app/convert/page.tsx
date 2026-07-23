import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { POPULAR_COINS, POPULAR_CONVERT_CURRENCIES } from "@/lib/data/popularCoins";
import LinkCard from "@/components/common/LinkCard";

export const metadata: Metadata = {
  title: "Crypto to Fiat Conversion Pages — Live Rates",
  description:
    "Browse live conversion rates for popular cryptocurrencies against major world currencies: USD, EUR, GBP, JPY, INR and more.",
  alternates: { canonical: "/convert" },
};

export default function ConvertIndexPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Conversion Rates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Live conversion rates for {POPULAR_COINS.length} popular coins against{" "}
          {POPULAR_CONVERT_CURRENCIES.length} world currencies — or use the{" "}
          <Typography component="a" href="/converter" color="primary.main">
            interactive converter
          </Typography>{" "}
          for any coin and currency.
        </Typography>
      </Stack>

      {POPULAR_COINS.map((coin) => (
        <Stack key={coin.id} spacing={1.5} sx={{ mb: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {coin.name} ({coin.symbol.toUpperCase()})
            </Typography>
          </Stack>
          <Grid container spacing={1.5}>
            {POPULAR_CONVERT_CURRENCIES.map((currency) => (
              <Grid size={{ xs: 6, sm: 4, md: 2.4 }} key={currency}>
                <LinkCard href={`/convert/${coin.id}/${currency}`} sx={{ p: 1.5, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {coin.symbol.toUpperCase()} → {currency.toUpperCase()}
                  </Typography>
                </LinkCard>
              </Grid>
            ))}
          </Grid>
        </Stack>
      ))}
    </Container>
  );
}
