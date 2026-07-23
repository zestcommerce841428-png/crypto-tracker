import { NextRequest, NextResponse } from "next/server";
import { searchCoins } from "@/lib/api/coingecko";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("q")?.trim();
  if (!query) return NextResponse.json({ coins: [] });
  try {
    const result = await searchCoins(query);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({ coins: [] }, { status: 502 });
  }
}
