import { NextRequest, NextResponse } from "next/server";
import { getCoinDetail } from "@/lib/api/coingecko";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const coin = await getCoinDetail(id);
    return NextResponse.json(coin, {
      headers: { "Cache-Control": "public, s-maxage=90, stale-while-revalidate=180" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load coin" },
      { status: 502 }
    );
  }
}
