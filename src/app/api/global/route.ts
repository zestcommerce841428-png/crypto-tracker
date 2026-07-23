import { NextResponse } from "next/server";
import { getGlobal } from "@/lib/api/coingecko";

export async function GET() {
  try {
    const data = await getGlobal();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=90, stale-while-revalidate=180" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load global data" },
      { status: 502 }
    );
  }
}
