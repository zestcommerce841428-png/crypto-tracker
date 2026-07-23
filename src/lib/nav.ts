export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "News", href: "/news" },
];

export const exploreNavGroups: NavGroup[] = [
  {
    label: "Discover",
    items: [
      { label: "All Coins", href: "/all-coins", description: "Full A-Z directory of every tracked coin" },
      { label: "Trending", href: "/trending", description: "Hottest coins right now" },
      { label: "Gainers & Losers", href: "/gainers-losers", description: "Top 24h movers" },
      { label: "Highest Volume", href: "/top/highest-volume", description: "Most-traded coins by 24h volume" },
      { label: "Best Performers (7d)", href: "/top/best-performers", description: "Top weekly gainers" },
      { label: "New Listings", href: "/new-listings", description: "Recently added coins" },
      { label: "Categories", href: "/categories", description: "Browse coins by sector" },
      { label: "Exchanges", href: "/exchanges", description: "Ranked crypto exchanges" },
      { label: "NFTs", href: "/nft", description: "Top NFT collections" },
      { label: "Blockchain Networks", href: "/platforms", description: "Coins by ecosystem" },
      { label: "World Currencies", href: "/currencies", description: "Prices in 36 world currencies" },
      { label: "DeFi", href: "/defi", description: "DeFi market cap & top protocols" },
      { label: "Derivatives", href: "/derivatives", description: "Futures & perpetuals data" },
      { label: "Staking (PoS)", href: "/staking", description: "Top proof-of-stake coins" },
      { label: "Company Treasuries", href: "/treasury", description: "Public companies holding BTC/ETH" },
      { label: "Binance Trading Pairs", href: "/binance-pairs", description: "Every live Binance spot pair" },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "Converter", href: "/converter", description: "Convert between currencies" },
      { label: "Conversion Pages", href: "/convert", description: "Live crypto-to-fiat rate pages" },
      { label: "Compare", href: "/compare", description: "Compare up to 4 coins" },
      { label: "Screener", href: "/screener", description: "Filter coins by metrics" },
      { label: "Calculator", href: "/calculator", description: "Profit/loss calculator" },
      { label: "Historical Data", href: "/historical-data", description: "Past prices by date" },
      { label: "Price Alerts", href: "/alerts", description: "Set custom price alerts" },
      { label: "Fear & Greed Index", href: "/fear-greed-index", description: "Market sentiment gauge" },
      { label: "Halving Countdown", href: "/halving", description: "Bitcoin halving tracker" },
      { label: "Gas Tracker", href: "/gas-tracker", description: "Ethereum gas fees" },
      { label: "Exchange Rates", href: "/exchange-rates", description: "BTC to world currencies & metals" },
      { label: "Token Lookup", href: "/token-lookup", description: "Find a token by contract address" },
    ],
  },
];

export const footerNavGroups: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Dashboard", href: "/" },
      { label: "Markets", href: "/markets" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Watchlist", href: "/watchlist" },
      { label: "Converter", href: "/converter" },
      { label: "Compare Coins", href: "/compare" },
    ],
  },
  {
    label: "Explore",
    items: [
      { label: "All Coins", href: "/all-coins" },
      { label: "Trending", href: "/trending" },
      { label: "Categories", href: "/categories" },
      { label: "Exchanges", href: "/exchanges" },
      { label: "News", href: "/news" },
      { label: "Screener", href: "/screener" },
      { label: "Blockchain Networks", href: "/platforms" },
      { label: "Conversion Pages", href: "/convert" },
      { label: "World Currencies", href: "/currencies" },
      { label: "DeFi", href: "/defi" },
      { label: "Derivatives", href: "/derivatives" },
      { label: "Staking (PoS)", href: "/staking" },
      { label: "Company Treasuries", href: "/treasury" },
      { label: "Binance Trading Pairs", href: "/binance-pairs" },
      { label: "Exchange Rates", href: "/exchange-rates" },
      { label: "Token Lookup", href: "/token-lookup" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", href: "/about" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Sitemap", href: "/sitemap-page" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Disclaimer", href: "/disclaimer" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];
