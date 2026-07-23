import { NextRequest, NextResponse } from "next/server";
import { getSimplePrice } from "@/lib/api/coingecko";

// Wraps CoinGecko's /simple/price — a much lighter endpoint than
// /coins/markets when all a caller needs is "current price + 24h change"
// for a handful of coin ids (e.g. checking price alert thresholds).
export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json({});

  try {
    const data = await getSimplePrice(ids.split(","), ["usd"]);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load prices" },
      { status: 502 }
    );
  }
}
