// Major world fiat currencies supported by CoinGecko's /simple/price and
// /coins/markets endpoints, plus BTC/ETH as crypto-denominated bases.
export const VS_CURRENCIES = [
  "usd",
  "eur",
  "gbp",
  "jpy",
  "aud",
  "cad",
  "chf",
  "cny",
  "inr",
  "krw",
  "brl",
  "rub",
  "try",
  "mxn",
  "idr",
  "php",
  "thb",
  "vnd",
  "zar",
  "sgd",
  "hkd",
  "nzd",
  "sek",
  "nok",
  "dkk",
  "pln",
  "aed",
  "sar",
  "ils",
  "pkr",
  "bdt",
  "ngn",
  "twd",
  "myr",
  "clp",
  "cop",
  "ars",
  "btc",
  "eth",
] as const;
export type VsCurrency = (typeof VS_CURRENCIES)[number];

export const CURRENCY_LABELS: Record<string, string> = {
  usd: "US Dollar",
  eur: "Euro",
  gbp: "British Pound",
  jpy: "Japanese Yen",
  aud: "Australian Dollar",
  cad: "Canadian Dollar",
  chf: "Swiss Franc",
  cny: "Chinese Yuan",
  inr: "Indian Rupee",
  krw: "South Korean Won",
  brl: "Brazilian Real",
  rub: "Russian Ruble",
  try: "Turkish Lira",
  mxn: "Mexican Peso",
  idr: "Indonesian Rupiah",
  php: "Philippine Peso",
  thb: "Thai Baht",
  vnd: "Vietnamese Dong",
  zar: "South African Rand",
  sgd: "Singapore Dollar",
  hkd: "Hong Kong Dollar",
  nzd: "New Zealand Dollar",
  sek: "Swedish Krona",
  nok: "Norwegian Krone",
  dkk: "Danish Krone",
  pln: "Polish Zloty",
  aed: "UAE Dirham",
  sar: "Saudi Riyal",
  ils: "Israeli Shekel",
  pkr: "Pakistani Rupee",
  bdt: "Bangladeshi Taka",
  ngn: "Nigerian Naira",
  twd: "Taiwan Dollar",
  myr: "Malaysian Ringgit",
  clp: "Chilean Peso",
  cop: "Colombian Peso",
  ars: "Argentine Peso",
  btc: "Bitcoin",
  eth: "Ethereum",
};

const CURRENCY_LOCALE: Record<string, string> = {
  usd: "en-US",
  inr: "en-IN",
  eur: "de-DE",
  gbp: "en-GB",
  jpy: "ja-JP",
  aud: "en-AU",
  cad: "en-CA",
};

export function formatCurrency(
  value: number | null | undefined,
  currency: string = "usd",
  opts: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  if (currency === "btc" || currency === "eth") {
    return `${value.toFixed(8)} ${currency.toUpperCase()}`;
  }
  const locale = CURRENCY_LOCALE[currency] ?? "en-US";
  const abs = Math.abs(value);
  const maximumFractionDigits =
    opts.maximumFractionDigits ?? (abs < 1 ? 6 : abs < 100 ? 2 : 2);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency.toUpperCase(),
      maximumFractionDigits,
      minimumFractionDigits: opts.minimumFractionDigits ?? 2,
      ...opts,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency.toUpperCase()}`;
  }
}

export function formatCompactNumber(
  value: number | null | undefined,
  currency?: string
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const formatted = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
  return currency ? `${currencySymbol(currency)}${formatted}` : formatted;
}

export function currencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    usd: "$",
    inr: "₹",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    aud: "A$",
    cad: "C$",
    chf: "Fr",
    cny: "¥",
    krw: "₩",
    brl: "R$",
    rub: "₽",
    try: "₺",
    mxn: "$",
    idr: "Rp",
    php: "₱",
    thb: "฿",
    vnd: "₫",
    zar: "R",
    sgd: "S$",
    hkd: "HK$",
    nzd: "NZ$",
    sek: "kr",
    nok: "kr",
    dkk: "kr",
    pln: "zł",
    aed: "د.إ",
    sar: "﷼",
    ils: "₪",
    pkr: "₨",
    bdt: "৳",
    ngn: "₦",
    twd: "NT$",
    myr: "RM",
    clp: "$",
    cop: "$",
    ars: "$",
    btc: "₿",
    eth: "Ξ",
  };
  return symbols[currency] ?? "$";
}

export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatSupply(value: number | null | undefined): string {
  if (value === null || value === undefined) return "∞";
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function timeAgo(dateStr: string | number | Date): string {
  const d = new Date(dateStr);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count}${label} ago`;
  }
  return "just now";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
