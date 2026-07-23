import { NextResponse } from "next/server";
import { getBinanceExchangeInfo } from "@/lib/api/binance";

export async function GET() {
  const symbols = await getBinanceExchangeInfo();
  const trading = symbols
    .filter((s) => s.status === "TRADING" && s.isSpotTradingAllowed)
    .map((s) => ({ symbol: s.symbol, baseAsset: s.baseAsset, quoteAsset: s.quoteAsset }));

  return NextResponse.json(trading, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
