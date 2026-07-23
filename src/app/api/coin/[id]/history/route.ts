import "server-only";
import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "Missing date (dd-mm-yyyy)" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `${BASE_URL}/coins/${id}/history?date=${date}&localization=false`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8000) }
    );
    if (!res.ok) throw new Error(`CoinGecko history failed: ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load history" },
      { status: 502 }
    );
  }
}
