import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/api/coingecko";

// CoinGecko's /coins/list (which powers /api/coins-list) has no image
// field at all — icons only come from /coins/markets, which is paginated
// and rate-limited. Split into its own route so a slow or failed icon
// fetch never blocks the base coin list from rendering: the client shows
// the full list immediately with letter-avatar fallbacks, then swaps in
// real icons as this resolves.
//
// Page count is tuned to fit inside Vercel's serverless function timeout
// (10s on Hobby) — this is the honest ceiling for a single request; full
// icon coverage for all ~17,000 coins isn't achievable in one call no
// matter how this is tuned, since CoinGecko's own rate limit caps how
// fast pages can be fetched. A persistent cache populated incrementally
// by a scheduled job (once KV is provisioned) is the real path to 100%
// coverage — this covers the ~1,250 highest-traffic coins in the meantime.
export async function GET() {
  const pages = await Promise.all(
    [1, 2, 3, 4, 5].map((page) =>
      getMarkets({ perPage: 250, page, sparkline: false }).catch(() => [])
    )
  );

  const images: Record<string, string> = {};
  for (const page of pages) {
    for (const coin of page) {
      images[coin.id] = coin.image;
    }
  }

  return NextResponse.json(images, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
