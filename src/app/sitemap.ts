import type { MetadataRoute } from "next";
import { getMarkets, getCategories, getExchanges, getNftsList, getDerivativesExchanges } from "@/lib/api/coingecko";
import { POPULAR_COINS, POPULAR_CONVERT_CURRENCIES, BLOCKCHAIN_NETWORKS, getComparePairSlugs } from "@/lib/data/popularCoins";
import { VS_CURRENCIES } from "@/lib/utils/format";
import { siteUrl } from "@/lib/utils/site-url";

const staticRoutes = [
  "",
  "/markets",
  "/watchlist",
  "/portfolio",
  "/news",
  "/trending",
  "/gainers-losers",
  "/new-listings",
  "/categories",
  "/exchanges",
  "/nft",
  "/converter",
  "/compare",
  "/screener",
  "/calculator",
  "/historical-data",
  "/alerts",
  "/fear-greed-index",
  "/halving",
  "/gas-tracker",
  "/about",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
  "/cookies",
  "/platforms",
  "/convert",
  "/sitemap-page",
  "/currencies",
  "/defi",
  "/derivatives",
  "/staking",
  "/all-coins",
  "/top/highest-volume",
  "/top/best-performers",
  "/treasury",
  "/exchange-rates",
  "/token-lookup",
  "/binance-pairs",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "" ? "hourly" : "daily",
    priority: route === "" ? 1 : 0.7,
  }));

  try {
    const [coinPages, categories, exchanges] = await Promise.all([
      Promise.all(
        [1, 2].map((page) =>
          getMarkets({ perPage: 250, page, sparkline: false })
        )
      ),
      getCategories(),
      getExchanges(1, 150),
    ]);
    const coins = coinPages.flat();

    for (const coin of coins) {
      entries.push({
        url: `${siteUrl}/coin/${coin.id}`,
        changeFrequency: "hourly",
        priority: 0.6,
      });
    }
    for (const category of categories) {
      entries.push({
        url: `${siteUrl}/categories/${category.id}`,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }
    for (const exchange of exchanges) {
      entries.push({
        url: `${siteUrl}/exchanges/${exchange.id}`,
        changeFrequency: "daily",
        priority: 0.5,
      });
    }
    for (const coin of POPULAR_COINS) {
      for (const currency of POPULAR_CONVERT_CURRENCIES) {
        entries.push({
          url: `${siteUrl}/convert/${coin.id}/${currency}`,
          changeFrequency: "hourly",
          priority: 0.5,
        });
      }
    }
    for (const network of BLOCKCHAIN_NETWORKS) {
      entries.push({
        url: `${siteUrl}/categories/${network.categoryId}`,
        changeFrequency: "daily",
        priority: 0.4,
      });
    }
    for (const currency of VS_CURRENCIES) {
      if (currency === "btc" || currency === "eth") continue;
      entries.push({
        url: `${siteUrl}/currencies/${currency}`,
        changeFrequency: "hourly",
        priority: 0.5,
      });
    }
    for (const coin of POPULAR_COINS) {
      entries.push({
        url: `${siteUrl}/coin/${coin.id}/markets`,
        changeFrequency: "hourly",
        priority: 0.4,
      });
    }
    for (const slug of getComparePairSlugs()) {
      entries.push({
        url: `${siteUrl}/compare/${slug}`,
        changeFrequency: "hourly",
        priority: 0.5,
      });
    }

    const [nfts, derivExchanges] = await Promise.all([
      getNftsList(1, 50).catch(() => []),
      getDerivativesExchanges().catch(() => []),
    ]);
    for (const nft of nfts) {
      entries.push({
        url: `${siteUrl}/nft/${nft.id}`,
        changeFrequency: "daily",
        priority: 0.4,
      });
    }
    for (const ex of derivExchanges.slice(0, 20)) {
      entries.push({
        url: `${siteUrl}/derivatives/${ex.id}`,
        changeFrequency: "daily",
        priority: 0.4,
      });
    }
  } catch {
    // Fall back to static routes only if the API is unreachable at build time.
  }

  return entries;
}
