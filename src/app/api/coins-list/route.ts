import { NextResponse } from "next/server";
import { getCoinsList, getMarkets } from "@/lib/api/coingecko";

// Serves the full ~16,000-coin list from a single cached endpoint so the
// client fetches it once (long browser/CDN cache) instead of it being
// re-embedded as a giant RSC payload on every /all-coins page render.
//
// CoinGecko's /coins/list has no image field at all, so we merge in icons
// from /coins/markets (which does) for the ~1,000 top-ranked coins that
// cover the vast majority of real traffic. Coins outside that ranked set
// simply have no `image` and fall back to a letter avatar client-side.
export async function GET() {
  try {
    const [coins, marketPages] = await Promise.all([
      getCoinsList(),
      Promise.all(
        [1, 2, 3, 4].map((page) =>
          getMarkets({ perPage: 250, page, sparkline: false }).catch(() => [])
        )
      ),
    ]);

    const imageById = new Map<string, string>();
    for (const page of marketPages) {
      for (const coin of page) {
        imageById.set(coin.id, coin.image);
      }
    }

    const withImages = coins.map((coin) => ({
      ...coin,
      image: imageById.get(coin.id),
    }));

    return NextResponse.json(withImages, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load coins list" },
      { status: 502 }
    );
  }
}
