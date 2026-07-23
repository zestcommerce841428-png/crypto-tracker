import { NextRequest, NextResponse } from "next/server";
import { getCoinMarketChartRange, type VsCurrency } from "@/lib/api/coingecko";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sp = req.nextUrl.searchParams;
  const vsCurrency = (sp.get("vs_currency") as VsCurrency) ?? "usd";
  const from = Number(sp.get("from"));
  const to = Number(sp.get("to"));

  if (!from || !to) {
    return NextResponse.json({ error: "Missing from/to (unix seconds)" }, { status: 400 });
  }

  try {
    const data = await getCoinMarketChartRange(id, vsCurrency, from, to);
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load chart range" },
      { status: 502 }
    );
  }
}
