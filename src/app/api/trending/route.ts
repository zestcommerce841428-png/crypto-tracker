import { NextResponse } from "next/server";
import { getTrending } from "@/lib/api/coingecko";

export async function GET() {
  try {
    const data = await getTrending();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=360" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load trending" },
      { status: 502 }
    );
  }
}
