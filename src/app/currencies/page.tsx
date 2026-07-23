import type { Metadata } from "next";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { VS_CURRENCIES, CURRENCY_LABELS, currencySymbol } from "@/lib/utils/format";
import { getSupportedVsCurrencies } from "@/lib/api/coingecko";
import LinkCard from "@/components/common/LinkCard";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Crypto Prices in World Currencies — USD, EUR, INR, JPY & More",
  description:
    "Browse live cryptocurrency prices denominated in major world currencies, from US Dollars to Indian Rupees, Euros, Japanese Yen and more.",
  alternates: { canonical: "/currencies" },
};

export default async function CurrenciesPage() {
  const fiat = VS_CURRENCIES.filter((c) => c !== "btc" && c !== "eth");
  const allSupported = await getSupportedVsCurrencies().catch(() => []);
  const totalCount = allSupported.length || fiat.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Prices by World Currency
        </Typography>
        <Typography variant="body1" color="text.secondary">
          CoinGecko supports {totalCount} currencies in total — every one of them works at{" "}
          <code>/currencies/[code]</code>. The {fiat.length} most-used are highlighted below.
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        {fiat.map((code) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={code}>
            <LinkCard href={`/currencies/${code}`} sx={{ textAlign: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {currencySymbol(code)} {code.toUpperCase()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {CURRENCY_LABELS[code] ?? code.toUpperCase()}
              </Typography>
            </LinkCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
