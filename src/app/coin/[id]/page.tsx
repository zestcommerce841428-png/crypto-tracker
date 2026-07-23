import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { getCoinDetail } from "@/lib/api/coingecko";
import CoinHeader from "@/components/coin/CoinHeader";
import CoinPriceChart from "@/components/charts/CoinPriceChart";
import CoinStatsGrid from "@/components/coin/CoinStatsGrid";
import CoinExtendedStats from "@/components/coin/CoinExtendedStats";
import CoinAboutSection from "@/components/coin/CoinAboutSection";
import CoinTickersTable from "@/components/coin/CoinTickersTable";
import LiveOrderBook from "@/components/coin/LiveOrderBook";
import LiveRecentTrades from "@/components/coin/LiveRecentTrades";

export const revalidate = 90;
export const dynamicParams = true;

// Pages render on-demand (ISR) and are cached after first request — with
// 10,000+ coins, pre-building even a few dozen pages at build time saturates
// CoinGecko's free-tier rate limit and times out the build.
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const coin = await getCoinDetail(id);
    const price = coin.market_data?.current_price?.usd;
    const title = `${coin.name} (${coin.symbol.toUpperCase()}) Price, Chart & Market Cap`;
    const description = `Live ${coin.name} price today is $${price?.toLocaleString()}. Track ${coin.name} market cap, 24h volume, supply, and historical charts.`;
    return {
      title,
      description,
      alternates: { canonical: `/coin/${id}` },
      openGraph: { title, description, images: [coin.image?.large] },
    };
  } catch {
    return { title: "Coin Not Found" };
  }
}

export default async function CoinDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let coin;
  try {
    coin = await getCoinDetail(id);
  } catch {
    notFound();
  }

  const md = coin.market_data;
  const links = [
    ...(coin.links.homepage?.filter(Boolean).map((url) => ({ label: "Website", href: url })) ?? []),
    ...(coin.links.blockchain_site?.filter(Boolean).slice(0, 1).map((url) => ({ label: "Explorer", href: url })) ?? []),
    ...(coin.links.repos_url?.github?.filter(Boolean).slice(0, 1).map((url) => ({ label: "GitHub", href: url })) ?? []),
    ...(coin.links.subreddit_url ? [{ label: "Reddit", href: coin.links.subreddit_url }] : []),
    ...(coin.links.twitter_screen_name
      ? [{ label: "Twitter/X", href: `https://twitter.com/${coin.links.twitter_screen_name}` }]
      : []),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: coin.name,
    description: `${coin.name} (${coin.symbol.toUpperCase()}) live price, market cap, and statistics.`,
    image: coin.image?.large,
    offers: {
      "@type": "Offer",
      price: md.current_price?.usd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Stack spacing={3}>
        <CoinHeader
          id={coin.id}
          name={coin.name}
          symbol={coin.symbol}
          image={coin.image.large}
          rank={coin.market_cap_rank}
          priceByCurrency={md.current_price}
          change24h={md.price_change_percentage_24h}
        />

        <Paper variant="outlined" sx={{ p: 2 }}>
          <CoinPriceChart coinId={coin.id} />
        </Paper>

        <CoinStatsGrid coin={coin} />

        <CoinExtendedStats coin={coin} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CoinAboutSection
              name={coin.name}
              descriptionHtml={coin.description?.en ?? ""}
              categories={coin.categories?.filter(Boolean) ?? []}
              links={links}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={2}>
              <LiveOrderBook symbol={coin.symbol} />
              <LiveRecentTrades symbol={coin.symbol} />
              <CoinTickersTable coinId={coin.id} tickers={coin.tickers ?? []} />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
