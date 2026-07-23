# CryptoTracker

A production-ready cryptocurrency tracker built with **Next.js 16**, **MUI v7**, and live data
from **CoinGecko** (market data) and **Binance** (live ticker/kline data), with news from
CryptoCompare and sentiment from Alternative.me.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Components, ISR)
- **MUI v7** + Emotion for theming (light/dark mode)
- **@mui/x-charts** for sparklines, price charts, and portfolio allocation
- **Zustand** (persisted) for watchlist, portfolio, alerts, and settings — all client-side only
- **SWR** for client-side data refresh/polling
- **TypeScript**, strict mode

## Data sources

| Source | Used for |
|---|---|
| CoinGecko public API | Market data, coin details, categories, exchanges, trending, search, historical prices |
| Binance public REST/WS | Live ticker & kline data (client `src/lib/api/binance.ts`) |
| CryptoCompare news API | `/news` |
| Alternative.me | `/fear-greed-index` |
| mempool.space | `/halving` block height |
| Etherscan gas oracle | `/gas-tracker` (degrades gracefully without a key) |

CoinGecko's free tier has a tight rate limit, so all server-side calls go through
`src/lib/api/coingecko.ts`, which throttles outbound requests and layers Next's `fetch`
cache (`revalidate`) on top — most requests are served from cache, not the network.

## Pages

Core: Dashboard, Markets (paginated to ~17,500 coins), Coin Detail (`/coin/[id]`), Coin Markets
(`/coin/[id]/markets` — full ticker list), Watchlist, Portfolio.
Discovery: Trending, Gainers & Losers, Categories (+ detail), Exchanges (+ detail, 150 ranked),
New Listings, NFTs, Blockchain Networks (`/platforms`).
Markets data: DeFi overview, Derivatives (futures/perpetuals), Staking (proof-of-stake coins),
World Currencies (`/currencies` — 36 fiat currencies, each with its own top-100 view).
Tools: Converter, Conversion Pages (`/convert/[from]/[to]` — SEO rate pages for any coin/currency
pair), Compare, Screener, Calculator, Historical Data, Price Alerts, Fear & Greed Index, Halving
Countdown, Gas Tracker, News.
Info/legal: About, FAQ, Contact, Privacy, Terms, Disclaimer, Cookies, Sitemap.

Combined with the dynamic `/coin/[id]`, `/coin/[id]/markets`, `/categories/[id]`,
`/exchanges/[id]`, `/currencies/[code]`, and `/convert/[from]/[to]` routes — covering CoinGecko's
full coin universe, ~15 categories, 150 exchanges, 36 currencies, and hundreds of coin/currency
conversion combinations — the site generates well over a thousand real, indexable pages. See
`src/app/sitemap.ts` for what's explicitly listed (any other coin id or currency code still
works on-demand, since `dynamicParams: true` lets ISR render and cache pages the sitemap
doesn't enumerate).

## Privacy

Watchlist, portfolio holdings, and price alerts are stored only in `localStorage` via
Zustand's `persist` middleware. No account, no server-side user data.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production build
```

Optional env vars (`.env.local`):

```
COINGECKO_API_KEY=            # optional demo API key, raises free-tier rate limits
NEXT_PUBLIC_SITE_URL=https://your-domain.com   # used in metadata, sitemap, robots.txt
```

## Notes on this environment

- The project was scaffolded on Windows; if you ever see a **Next.js CLI segfault**
  (`next build`/`next info` crashing with exit code 5 and no output), it means the native
  `@next/swc-*` addon got corrupted mid-download. Fix: delete
  `node_modules/@next/swc-win32-x64-msvc` and reinstall it.
- `generateStaticParams` for all dynamic routes (`/coin/[id]`, `/coin/[id]/markets`,
  `/categories/[id]`, `/exchanges/[id]`, `/currencies/[code]`, `/convert/[from]/[to]`) returns
  `[]` on purpose — pages render on-demand via ISR (`revalidate`) and get cached after the
  first request. Pre-building even a few dozen coin pages at build time saturates
  CoinGecko's free-tier rate limit and times out the build.
- `getDerivatives()` fetches with `cache: "no-store"` — the full `/derivatives` payload can run
  10MB+, which exceeds Next's 2MB data-cache entry limit and errors the build if cached.
- If a production build ever times out generating `/exchanges`, `/staking`, or `/sitemap.xml`
  (pages that fan out into several sequential CoinGecko calls), that's the free-tier's rate
  limiting/latency, not a code bug — `staticPageGenerationTimeout` in `next.config.ts` is set to
  180s to give it room; it occasionally still needs a retry or two on the first build.
