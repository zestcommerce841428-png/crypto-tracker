import "server-only";
import type {
  CoinMarket,
  CoinDetail,
  TrendingCoin,
  GlobalMarketData,
  CoinCategory,
  Exchange,
} from "@/lib/types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;

// `process.env.NEXT_PHASE` is NOT reliably set inside Turbopack's build
// worker processes (confirmed: builds started failing faster after trying
// to key retry budget off it), so this uses one bounded policy for both
// build and runtime instead of guessing which phase we're in. Worst case
// total wait is ~1 minute (well short of the 90-120s that caused pages to
// feel frozen before), while still giving `next build` enough patience to
// ride out CoinGecko's free-tier rate limit.
const MAX_RETRIES = 6;
const MAX_BACKOFF_MS = 8000;
const REQUEST_TIMEOUT_MS = 10000;

// Free-tier CoinGecko allows roughly 10-30 req/min per IP. We serialize
// outbound requests with a minimum gap so a burst of concurrent server
// renders never trips the limit, and we lean on Next's fetch cache
// (revalidate) so most requests never hit the network at all.
const MIN_GAP_MS = 2000;
let lastCallAt = 0;
let chain: Promise<void> = Promise.resolve();

function throttle(): Promise<void> {
  const run = chain.then(async () => {
    const wait = Math.max(0, lastCallAt + MIN_GAP_MS - Date.now());
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCallAt = Date.now();
  });
  chain = run.catch(() => undefined);
  return run;
}

interface FetchOpts {
  revalidate?: number;
  tags?: string[];
  noStore?: boolean;
  retriesLeft?: number;
}

async function cgFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  { revalidate = 60, tags, noStore = false, retriesLeft = MAX_RETRIES }: FetchOpts = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }
  if (API_KEY) url.searchParams.set("x_cg_demo_api_key", API_KEY);

  await throttle();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { accept: "application/json" },
      signal: controller.signal,
      // Some endpoints (e.g. /derivatives) return multi-MB payloads that
      // exceed Next's 2MB data-cache entry limit and error if cached.
      ...(noStore ? { cache: "no-store" as const } : { next: { revalidate, tags } }),
    });
  } catch (err) {
    // Covers both transient network errors (ECONNRESET) and our own
    // timeout abort — retry a bounded number of times before giving up.
    if (retriesLeft > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return cgFetch<T>(path, params, { revalidate, tags, noStore, retriesLeft: retriesLeft - 1 });
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    if (res.status === 429 && retriesLeft > 0) {
      const retryAfterHeader = Number(res.headers.get("retry-after"));
      const backoff = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
        ? Math.min(retryAfterHeader * 1000 + 500, MAX_BACKOFF_MS)
        : Math.min(2000 + (MAX_RETRIES - retriesLeft) * 2000, MAX_BACKOFF_MS);
      await new Promise((r) => setTimeout(r, backoff));
      return cgFetch<T>(path, params, { revalidate, tags, noStore, retriesLeft: retriesLeft - 1 });
    }
    throw new Error(`CoinGecko ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export { VS_CURRENCIES, type VsCurrency } from "@/lib/utils/format";
import type { VsCurrency } from "@/lib/utils/format";

export function getMarkets(opts: {
  vsCurrency?: VsCurrency;
  page?: number;
  perPage?: number;
  category?: string;
  order?: string;
  ids?: string[];
  sparkline?: boolean;
  priceChangePercentage?: string;
}): Promise<CoinMarket[]> {
  return cgFetch<CoinMarket[]>(
    "/coins/markets",
    {
      vs_currency: opts.vsCurrency ?? "usd",
      order: opts.order ?? "market_cap_desc",
      per_page: opts.perPage ?? 100,
      page: opts.page ?? 1,
      sparkline: opts.sparkline ?? true,
      price_change_percentage: opts.priceChangePercentage ?? "1h,24h,7d,30d",
      category: opts.category,
      ids: opts.ids?.join(","),
    },
    { revalidate: 60, tags: ["markets"] }
  );
}

export function getCoinDetail(id: string): Promise<CoinDetail> {
  return cgFetch<CoinDetail>(
    `/coins/${id}`,
    {
      localization: false,
      tickers: true,
      market_data: true,
      community_data: true,
      developer_data: true,
      sparkline: true,
    },
    { revalidate: 90, tags: [`coin-${id}`] }
  );
}

export function getCoinMarketChart(
  id: string,
  vsCurrency: VsCurrency = "usd",
  days: number | "max" = 30
): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] }> {
  return cgFetch(
    `/coins/${id}/market_chart`,
    { vs_currency: vsCurrency, days },
    { revalidate: days === 1 ? 60 : 300 }
  );
}

export function getCoinMarketChartRange(
  id: string,
  vsCurrency: VsCurrency,
  fromUnixSeconds: number,
  toUnixSeconds: number
): Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] }> {
  return cgFetch(
    `/coins/${id}/market_chart/range`,
    { vs_currency: vsCurrency, from: fromUnixSeconds, to: toUnixSeconds },
    { revalidate: 3600 }
  );
}

export function getCoinOHLC(
  id: string,
  vsCurrency: VsCurrency = "usd",
  days: number = 30
): Promise<[number, number, number, number, number][]> {
  return cgFetch(
    `/coins/${id}/ohlc`,
    { vs_currency: vsCurrency, days },
    { revalidate: 300 }
  );
}

export function getTrending(): Promise<{ coins: TrendingCoin[] }> {
  return cgFetch("/search/trending", {}, { revalidate: 180, tags: ["trending"] });
}

export function getGlobal(): Promise<{ data: GlobalMarketData }> {
  return cgFetch("/global", {}, { revalidate: 90, tags: ["global"] });
}

export interface AssetPlatform {
  id: string;
  chain_identifier: number | null;
  name: string;
  shortname: string;
  native_coin_id: string | null;
}

export function getAssetPlatforms(): Promise<AssetPlatform[]> {
  return cgFetch("/asset_platforms", {}, { revalidate: 3600, tags: ["asset-platforms"] });
}

export function getCategories(): Promise<CoinCategory[]> {
  return cgFetch("/coins/categories", {}, { revalidate: 300, tags: ["categories"] });
}

export function getExchanges(page = 1, perPage = 100): Promise<Exchange[]> {
  return cgFetch(
    "/exchanges",
    { page, per_page: perPage },
    { revalidate: 600, tags: ["exchanges"] }
  );
}

export function getExchangeDetail(id: string) {
  return cgFetch(`/exchanges/${id}`, {}, { revalidate: 600 });
}

// [timestamp_ms, volume_btc] pairs.
export function getExchangeVolumeChart(id: string, days: number = 30): Promise<[number, string][]> {
  return cgFetch(`/exchanges/${id}/volume_chart`, { days }, { revalidate: 600 });
}

export function searchCoins(query: string) {
  return cgFetch<{
    coins: Array<{
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number | null;
      thumb: string;
      large: string;
    }>;
  }>("/search", { query }, { revalidate: 120 });
}

export function getCoinsList(): Promise<
  Array<{ id: string; symbol: string; name: string }>
> {
  return cgFetch("/coins/list", {}, { revalidate: 3600, tags: ["coins-list"] });
}

export function getSupportedVsCurrencies(): Promise<string[]> {
  return cgFetch("/simple/supported_vs_currencies", {}, { revalidate: 3600 });
}

export interface GlobalDefiData {
  defi_market_cap: string;
  eth_market_cap: string;
  defi_to_eth_ratio: string;
  trading_volume_24h: string;
  defi_dominance: string;
  top_coin_name: string;
  top_coin_defi_dominance: number;
}

export function getGlobalDefi(): Promise<{ data: GlobalDefiData }> {
  return cgFetch("/global/decentralized_finance_defi", {}, { revalidate: 600, tags: ["defi"] });
}

export interface DerivativeTicker {
  market: string;
  symbol: string;
  index_id: string;
  price: string;
  price_percentage_change_24h: number;
  contract_type: string;
  index: number;
  basis: number;
  spread: number;
  funding_rate: number;
  open_interest: number;
  volume_24h: number;
  last_traded_at: number;
}

export function getDerivatives(): Promise<DerivativeTicker[]> {
  // Full payload can run 10MB+ across all exchanges/pairs — too big for
  // Next's data cache, so this always hits the network fresh.
  return cgFetch("/derivatives", {}, { noStore: true });
}

export interface DerivativesExchange {
  name: string;
  id: string;
  open_interest_btc: number;
  trade_volume_24h_btc: string;
  number_of_perpetual_pairs: number;
  number_of_futures_pairs: number;
  image: string;
  year_established: number | null;
  country: string | null;
  url: string;
}

export function getDerivativesExchanges(): Promise<DerivativesExchange[]> {
  return cgFetch(
    "/derivatives/exchanges",
    { order: "open_interest_btc_desc", per_page: 50, page: 1 },
    { revalidate: 600, tags: ["derivatives-exchanges"] }
  );
}

export function getNftsList(page = 1, perPage = 50): Promise<
  Array<{ id: string; contract_address: string; name: string; asset_platform_id: string; symbol: string }>
> {
  return cgFetch(
    "/nfts/list",
    { order: "market_cap_usd_desc", per_page: perPage, page },
    { revalidate: 600, tags: ["nfts"] }
  );
}

export function getSimplePrice(
  ids: string[],
  vsCurrencies: string[] = ["usd"]
): Promise<Record<string, Record<string, number>>> {
  return cgFetch(
    "/simple/price",
    {
      ids: ids.join(","),
      vs_currencies: vsCurrencies.join(","),
      include_24hr_change: true,
      include_market_cap: true,
    },
    { revalidate: 45 }
  );
}

export interface NftDetail {
  id: string;
  contract_address: string;
  name: string;
  symbol: string;
  asset_platform_id: string;
  image: { small: string };
  description: string;
  native_currency: string;
  floor_price: Record<string, number>;
  market_cap: Record<string, number>;
  volume_24h: Record<string, number>;
  floor_price_24h_percentage_change: Record<string, number>;
  number_of_unique_addresses: number;
  total_supply: number;
  links?: { homepage?: string; twitter?: string; discord?: string };
}

export function getNftDetail(id: string): Promise<NftDetail> {
  return cgFetch(`/nfts/${id}`, {}, { revalidate: 600, tags: [`nft-${id}`] });
}

export interface NftMarketChart {
  floor_price_usd: [number, number][];
  floor_price_native: [number, number][];
  h24_volume_usd: [number, number][];
  market_cap_usd: [number, number][];
}

export function getNftMarketChart(id: string, days: number = 30): Promise<NftMarketChart> {
  return cgFetch(`/nfts/${id}/market_chart`, { days }, { revalidate: 600 });
}

export interface DerivativesExchangeDetail extends DerivativesExchange {
  description: string;
  tickers: DerivativeTicker[];
}

export function getDerivativesExchangeDetail(id: string): Promise<DerivativesExchangeDetail> {
  return cgFetch(
    `/derivatives/exchanges/${id}`,
    { include_tickers: "unexpired" },
    // Tickers payload can be large like /derivatives; skip the data cache.
    { noStore: true }
  );
}

export interface CompanyTreasuryHolding {
  name: string;
  symbol: string;
  country: string;
  total_holdings: number;
  total_entry_value_usd: number;
  total_current_value_usd: number;
  percentage_of_total_supply: number;
}

export interface CompanyTreasuryData {
  total_holdings: number;
  total_value_usd: number;
  market_cap_dominance: number;
  companies: CompanyTreasuryHolding[];
}

export function getCompanyTreasury(coinId: "bitcoin" | "ethereum"): Promise<CompanyTreasuryData> {
  return cgFetch(`/companies/public_treasury/${coinId}`, {}, { revalidate: 3600, tags: ["treasury"] });
}

export function getExchangeRates(): Promise<{
  rates: Record<string, { name: string; unit: string; value: number; type: string }>;
}> {
  return cgFetch("/exchange_rates", {}, { revalidate: 600, tags: ["exchange-rates"] });
}

export interface ContractTokenInfo {
  id: string;
  symbol: string;
  name: string;
  image: { small: string; large: string };
  market_data: {
    current_price: Record<string, number>;
    market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    price_change_percentage_24h: number;
  };
}

export function getCoinByContract(
  platformId: string,
  contractAddress: string
): Promise<ContractTokenInfo> {
  return cgFetch(
    `/coins/${platformId}/contract/${contractAddress.toLowerCase()}`,
    { localization: false, tickers: false, community_data: false, developer_data: false },
    { revalidate: 300 }
  );
}
