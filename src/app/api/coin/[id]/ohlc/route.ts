import { NextRequest, NextResponse } from "next/server";
import { getCoinOHLC, type VsCurrency } from "@/lib/api/coingecko";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sp = req.nextUrl.searchParams;
  const vsCurrency = (sp.get("vs_currency") as VsCurrency) ?? "usd";
  const days = Number(sp.get("days") ?? "30");

  try {
    const raw = await getCoinOHLC(id, vsCurrency, days);
    const candles = raw.map(([time, open, high, low, close]) => ({
      time,
      open,
      high,
      low,
      close,
    }));
    return NextResponse.json(candles, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load OHLC data" },
      { status: 502 }
    );
  }
}
