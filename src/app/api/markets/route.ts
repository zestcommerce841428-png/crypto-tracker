import { NextRequest, NextResponse } from "next/server";
import { getMarkets, type VsCurrency } from "@/lib/api/coingecko";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  try {
    const coins = await getMarkets({
      vsCurrency: (sp.get("vs_currency") as VsCurrency) ?? "usd",
      page: Number(sp.get("page") ?? 1),
      perPage: Number(sp.get("per_page") ?? 100),
      category: sp.get("category") ?? undefined,
      order: sp.get("order") ?? "market_cap_desc",
    });
    return NextResponse.json(coins, {
      headers: { "Cache-Control": "public, s-maxage=45, stale-while-revalidate=90" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load markets" },
      { status: 502 }
    );
  }
}
