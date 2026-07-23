// Public Binance REST endpoints — no API key required. Used for
// low-latency live ticker/kline data to complement CoinGecko's
// market-cap/ranking data, which Binance doesn't provide.
const BINANCE_BASE = "https://api.binance.com/api/v3";

// Bounds every Binance REST call so a stalled connection can't hang a page
// indefinitely — same reasoning as the CoinGecko client's request timeout.
function timeoutSignal(ms = 8000): AbortSignal {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

export interface BinanceTicker24h {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
}

// Every USDT trading pair's 24h stats in a single call — this is what makes
// Binance viable as a *primary* data source instead of just a live-price
// supplement: one request covers thousands of pairs, versus CoinGecko's
// free tier needing one paginated /coins/markets call per ~100-250 coins
// and a much stingier rate limit.
export async function getBinanceAllUsdtTickers(): Promise<BinanceTicker24h[]> {
  try {
    const res = await fetch(`${BINANCE_BASE}/ticker/24hr`, {
      next: { revalidate: 30 },
      signal: timeoutSignal(8000),
    });
    if (!res.ok) return [];
    const all: BinanceTicker24h[] = await res.json();
    return all.filter((t) => t.symbol.endsWith("USDT") && Number(t.lastPrice) > 0);
  } catch {
    return [];
  }
}

export async function getBinanceTicker24h(
  symbol: string
): Promise<BinanceTicker24h | null> {
  try {
    const res = await fetch(
      `${BINANCE_BASE}/ticker/24hr?symbol=${symbol.toUpperCase()}`,
      { next: { revalidate: 15 }, signal: timeoutSignal() }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getBinanceKlines(
  symbol: string,
  interval: string = "1h",
  limit: number = 168
): Promise<BinanceKline[]> {
  try {
    const res = await fetch(
      `${BINANCE_BASE}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`,
      { next: { revalidate: 30 }, signal: timeoutSignal() }
    );
    if (!res.ok) return [];
    const raw: unknown[] = await res.json();
    return (raw as Array<unknown[]>).map((k) => ({
      openTime: k[0] as number,
      open: k[1] as string,
      high: k[2] as string,
      low: k[3] as string,
      close: k[4] as string,
      volume: k[5] as string,
      closeTime: k[6] as number,
    }));
  } catch {
    return [];
  }
}

export function binanceSymbolFor(baseSymbol: string, quote = "USDT") {
  return `${baseSymbol.toUpperCase()}${quote}`;
}

export interface BinanceSymbolInfo {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
  isSpotTradingAllowed: boolean;
}

// Full list of every live Binance spot trading pair — used to power a
// trading-pairs explorer independent of CoinGecko's coin-centric data.
export async function getBinanceExchangeInfo(): Promise<BinanceSymbolInfo[]> {
  try {
    // Full response runs 20MB+ (every symbol's filters/permissions), which
    // exceeds Next's 2MB data-cache entry limit — skip caching this fetch;
    // the /api/binance-pairs route re-caches just the fields it needs.
    const res = await fetch(`${BINANCE_BASE}/exchangeInfo`, {
      cache: "no-store",
      signal: timeoutSignal(12000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.symbols ?? []) as BinanceSymbolInfo[];
  } catch {
    return [];
  }
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
}

export interface OrderBookSnapshot {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export async function getBinanceOrderBook(
  symbol: string,
  limit: number = 20
): Promise<OrderBookSnapshot | null> {
  try {
    const res = await fetch(
      `${BINANCE_BASE}/depth?symbol=${symbol.toUpperCase()}&limit=${limit}`,
      { cache: "no-store", signal: timeoutSignal() }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      bids: (data.bids as [string, string][]).map(([p, q]) => ({ price: Number(p), quantity: Number(q) })),
      asks: (data.asks as [string, string][]).map(([p, q]) => ({ price: Number(p), quantity: Number(q) })),
    };
  } catch {
    return null;
  }
}

// Live order-book updates over WebSocket, layered on top of a REST snapshot
// by the caller (standard Binance local-order-book-maintenance pattern,
// simplified: we just re-sort each diff frame's top levels for display
// purposes rather than maintaining full incremental depth state).
export function openBinanceDepthWs(
  symbol: string,
  onMessage: (snapshot: OrderBookSnapshot) => void
): () => void {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@1000ms`
  );
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const bids = (data.bids as [string, string][] | undefined)?.map(([p, q]) => ({
        price: Number(p),
        quantity: Number(q),
      }));
      const asks = (data.asks as [string, string][] | undefined)?.map(([p, q]) => ({
        price: Number(p),
        quantity: Number(q),
      }));
      if (bids && asks) onMessage({ bids, asks });
    } catch {
      // ignore malformed frames
    }
  };
  return () => ws.close();
}

export function openBinanceWsTicker(
  symbol: string,
  onMessage: (data: { price: string; changePercent: string }) => void
): () => void {
  const ws = new WebSocket(
    `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`
  );
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage({ price: data.c, changePercent: data.P });
    } catch {
      // ignore malformed frames
    }
  };
  return () => ws.close();
}

export interface LiveTick {
  symbol: string;
  price: string;
  changePercent: string;
  high: string;
  low: string;
  volume: string;
}

// A single WebSocket carrying many symbols' ticker streams, using Binance's
// combined-stream endpoint. Far cheaper than opening one socket per symbol
// when displaying a live ticker strip or grid of many coins at once.
export function openBinanceCombinedTicker(
  symbols: string[],
  onMessage: (tick: LiveTick) => void,
  onStatusChange?: (status: "open" | "closed" | "error") => void
): () => void {
  if (symbols.length === 0) return () => undefined;
  const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
  const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);

  ws.onopen = () => onStatusChange?.("open");
  ws.onerror = () => onStatusChange?.("error");
  ws.onclose = () => onStatusChange?.("closed");
  ws.onmessage = (event) => {
    try {
      const frame = JSON.parse(event.data);
      const data = frame.data;
      if (!data?.s) return;
      onMessage({
        symbol: data.s as string,
        price: data.c,
        changePercent: data.P,
        high: data.h,
        low: data.l,
        volume: data.v,
      });
    } catch {
      // ignore malformed frames
    }
  };
  return () => ws.close();
}

export interface LiveTrade {
  id: number;
  price: number;
  quantity: number;
  time: number;
  isBuyerMaker: boolean;
}

// Real-time trade tape via Binance's public @trade stream — every executed
// trade on the pair, as it happens.
export function openBinanceTradeWs(
  symbol: string,
  onTrade: (trade: LiveTrade) => void
): () => void {
  const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onTrade({
        id: data.t,
        price: Number(data.p),
        quantity: Number(data.q),
        time: data.T,
        isBuyerMaker: data.m,
      });
    } catch {
      // ignore malformed frames
    }
  };
  return () => ws.close();
}
