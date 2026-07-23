import { NextRequest, NextResponse } from "next/server";
import { getCoinByContract } from "@/lib/api/coingecko";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const platform = sp.get("platform");
  const address = sp.get("address");

  if (!platform || !address) {
    return NextResponse.json({ error: "Missing platform or address" }, { status: 400 });
  }

  try {
    const token = await getCoinByContract(platform, address);
    return NextResponse.json(token, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json({ error: "Token not found for that platform/address" }, { status: 404 });
  }
}
