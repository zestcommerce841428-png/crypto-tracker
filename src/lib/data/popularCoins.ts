// A curated list of widely-held coins, used to seed the sitemap and the
// /convert index page. Any other coin id still works at /convert/[id]/[cur]
// via on-demand ISR — this list just drives which combinations get
// pre-listed for discovery/SEO rather than limiting what's reachable.
export const POPULAR_COINS = [
  { id: "bitcoin", symbol: "btc", name: "Bitcoin" },
  { id: "ethereum", symbol: "eth", name: "Ethereum" },
  { id: "tether", symbol: "usdt", name: "Tether" },
  { id: "binancecoin", symbol: "bnb", name: "BNB" },
  { id: "solana", symbol: "sol", name: "Solana" },
  { id: "ripple", symbol: "xrp", name: "XRP" },
  { id: "usd-coin", symbol: "usdc", name: "USD Coin" },
  { id: "cardano", symbol: "ada", name: "Cardano" },
  { id: "dogecoin", symbol: "doge", name: "Dogecoin" },
  { id: "avalanche-2", symbol: "avax", name: "Avalanche" },
  { id: "tron", symbol: "trx", name: "TRON" },
  { id: "chainlink", symbol: "link", name: "Chainlink" },
  { id: "polkadot", symbol: "dot", name: "Polkadot" },
  { id: "matic-network", symbol: "matic", name: "Polygon" },
  { id: "litecoin", symbol: "ltc", name: "Litecoin" },
  { id: "shiba-inu", symbol: "shib", name: "Shiba Inu" },
  { id: "bitcoin-cash", symbol: "bch", name: "Bitcoin Cash" },
  { id: "uniswap", symbol: "uni", name: "Uniswap" },
  { id: "stellar", symbol: "xlm", name: "Stellar" },
  { id: "near", symbol: "near", name: "NEAR Protocol" },
  { id: "internet-computer", symbol: "icp", name: "Internet Computer" },
  { id: "aptos", symbol: "apt", name: "Aptos" },
  { id: "cosmos", symbol: "atom", name: "Cosmos" },
  { id: "filecoin", symbol: "fil", name: "Filecoin" },
  { id: "arbitrum", symbol: "arb", name: "Arbitrum" },
  { id: "optimism", symbol: "op", name: "Optimism" },
  { id: "monero", symbol: "xmr", name: "Monero" },
  { id: "ethereum-classic", symbol: "etc", name: "Ethereum Classic" },
  { id: "vechain", symbol: "vet", name: "VeChain" },
  { id: "hedera-hashgraph", symbol: "hbar", name: "Hedera" },
] as const;

export const POPULAR_CONVERT_CURRENCIES = [
  "usd",
  "eur",
  "gbp",
  "jpy",
  "inr",
  "aud",
  "cad",
  "cny",
  "brl",
  "krw",
] as const;

// Every unique pair among the top 20 popular coins — 190 combinations —
// seeds the sitemap for /compare/[a]-vs-[b]. Any two coin ids still work at
// that route via on-demand ISR; this just drives which pairs get pre-listed.
export function getComparePairSlugs(): string[] {
  const top = POPULAR_COINS.slice(0, 20);
  const slugs: string[] = [];
  for (let i = 0; i < top.length; i++) {
    for (let j = i + 1; j < top.length; j++) {
      slugs.push(`${top[i].id}-vs-${top[j].id}`);
    }
  }
  return slugs;
}

// A hand-picked subset shown directly on the /compare tool page.
export const FEATURED_COMPARE_PAIRS = [
  ["bitcoin", "ethereum"],
  ["bitcoin", "solana"],
  ["ethereum", "solana"],
  ["bitcoin", "dogecoin"],
  ["ethereum", "binancecoin"],
  ["solana", "cardano"],
  ["ripple", "stellar"],
  ["polkadot", "cosmos"],
  ["arbitrum", "optimism"],
  ["litecoin", "bitcoin-cash"],
  ["chainlink", "uniswap"],
  ["avalanche-2", "near"],
] as const;

// Common EVM-compatible (and Solana) platform ids CoinGecko recognizes for
// contract-address token lookups.
export const CONTRACT_PLATFORMS = [
  { id: "ethereum", label: "Ethereum" },
  { id: "binance-smart-chain", label: "BNB Chain" },
  { id: "polygon-pos", label: "Polygon" },
  { id: "arbitrum-one", label: "Arbitrum" },
  { id: "optimistic-ethereum", label: "Optimism" },
  { id: "avalanche", label: "Avalanche" },
  { id: "base", label: "Base" },
  { id: "solana", label: "Solana" },
] as const;

// Major blockchain networks/ecosystems, mapped to a CoinGecko category id so
// each can reuse the existing /categories/[id] page for its coin listing.
export const BLOCKCHAIN_NETWORKS = [
  { name: "Ethereum", categoryId: "ethereum-ecosystem" },
  { name: "BNB Chain", categoryId: "binance-smart-chain" },
  { name: "Solana", categoryId: "solana-ecosystem" },
  { name: "Polygon", categoryId: "polygon-ecosystem" },
  { name: "Avalanche", categoryId: "avalanche-ecosystem" },
  { name: "Arbitrum", categoryId: "arbitrum-ecosystem" },
  { name: "Optimism", categoryId: "optimism-ecosystem" },
  { name: "Cosmos", categoryId: "cosmos-ecosystem" },
  { name: "Polkadot", categoryId: "polkadot-ecosystem" },
  { name: "TRON", categoryId: "tron-ecosystem" },
  { name: "Near Protocol", categoryId: "near-protocol-ecosystem" },
  { name: "Cardano", categoryId: "cardano-ecosystem" },
  { name: "Fantom", categoryId: "fantom-ecosystem" },
  { name: "Base", categoryId: "base-ecosystem" },
  { name: "Sui", categoryId: "sui-ecosystem" },
] as const;
