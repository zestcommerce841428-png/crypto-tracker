import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getMarkets, getSupportedVsCurrencies } from "@/lib/api/coingecko";
import { CURRENCY_LABELS, type VsCurrency } from "@/lib/utils/format";
import CoinMarketsTable from "@/components/coin/CoinMarketsTable";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const label = CURRENCY_LABELS[code.toLowerCase()] ?? code.toUpperCase();
  return {
    title: `Crypto Prices in ${label} (${code.toUpperCase()}) — Live Market Cap`,
    description: `Live cryptocurrency prices, market caps and 24h volume denominated in ${label} (${code.toUpperCase()}).`,
    alternates: { canonical: `/currencies/${code}` },
  };
}

export default async function CurrencyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const currency = code.toLowerCase();

  // Validated against CoinGecko's real, full list of officially supported
  // currencies (~70) via /simple/supported_vs_currencies, rather than just
  // our curated 38-currency UI subset — so any currency CoinGecko actually
  // supports works here, not only the ones surfaced on /currencies.
  const supported = await getSupportedVsCurrencies().catch((): string[] => []);
  if (supported.length > 0 && !supported.includes(currency)) {
    notFound();
  }

  const coins = await getMarkets({ vsCurrency: currency as VsCurrency, perPage: 100, page: 1 });
  const label = CURRENCY_LABELS[currency] ?? currency.toUpperCase();

  if (coins.length === 0) notFound();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Crypto Prices in {label} ({currency.toUpperCase()})
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Top 100 cryptocurrencies by market cap, priced in {currency.toUpperCase()}.
        </Typography>
      </Stack>
      <CoinMarketsTable coins={coins} vsCurrency={currency} />
    </Container>
  );
}
