import { NextRequest, NextResponse } from "next/server";
import { getBinanceAllUsdtTickers } from "@/lib/api/binance";

// Binance as a primary market-data source: no CoinGecko rate limit to
// worry about, live 24h stats for every USDT pair in one request. Doesn't
// carry market cap/rank (Binance has no concept of circulating supply),
// which is why this is offered as a "Live" view alongside — not instead
// of — the CoinGecko-ranked view.
export async function GET(req: NextRequest) {
  const sort = req.nextUrl.searchParams.get("sort") ?? "volume";
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "100");

  const tickers = await getBinanceAllUsdtTickers();

  const mapped = tickers.map((t) => ({
    symbol: t.symbol.replace(/USDT$/, ""),
    pair: t.symbol,
    price: Number(t.lastPrice),
    changePercent24h: Number(t.priceChangePercent),
    high24h: Number(t.highPrice),
    low24h: Number(t.lowPrice),
    volumeBase: Number(t.volume),
    volumeQuoteUsdt: Number(t.quoteVolume),
  }));

  mapped.sort((a, b) => {
    if (sort === "gainers") return b.changePercent24h - a.changePercent24h;
    if (sort === "losers") return a.changePercent24h - b.changePercent24h;
    return b.volumeQuoteUsdt - a.volumeQuoteUsdt;
  });

  return NextResponse.json(mapped.slice(0, limit), {
    headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" },
  });
}
