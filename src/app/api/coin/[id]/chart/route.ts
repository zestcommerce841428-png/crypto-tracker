import { NextRequest, NextResponse } from "next/server";
import { getCoinMarketChart, type VsCurrency } from "@/lib/api/coingecko";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sp = req.nextUrl.searchParams;
  const vsCurrency = (sp.get("vs_currency") as VsCurrency) ?? "usd";
  const daysParam = sp.get("days") ?? "30";
  const days = daysParam === "max" ? "max" : Number(daysParam);

  try {
    const data = await getCoinMarketChart(id, vsCurrency, days);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load chart" },
      { status: 502 }
    );
  }
}
