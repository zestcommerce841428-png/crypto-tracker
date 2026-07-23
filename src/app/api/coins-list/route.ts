import { NextResponse } from "next/server";
import { getCoinsList } from "@/lib/api/coingecko";

// Serves the full ~17,000-coin list from a single cached endpoint so the
// client fetches it once (long browser/CDN cache) instead of it being
// re-embedded as a giant RSC payload on every /all-coins page render.
//
// Icons are deliberately NOT merged in here anymore — that used to require
// several extra sequential CoinGecko calls in the same request, which
// pushed this route's response time to ~9.4s, right at the edge of
// Vercel's 10s function timeout. See /api/coin-images: the client fetches
// the icon map separately and merges it in once it arrives, so a slow or
// failed icon fetch can never block the base list from loading.
export async function GET() {
  try {
    const coins = await getCoinsList();
    return NextResponse.json(coins, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load coins list" },
      { status: 502 }
    );
  }
}
