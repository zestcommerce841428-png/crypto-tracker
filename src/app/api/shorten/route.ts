import { NextRequest, NextResponse } from "next/server";
import { createShortLink, isShortenerConfigured } from "@/lib/utils/shortener";
import { siteUrl } from "@/lib/utils/site-url";

export async function POST(req: NextRequest) {
  if (!isShortenerConfigured) {
    return NextResponse.json(
      { error: "Short links aren't configured on this deployment yet." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const targetUrl = body?.url;
  if (typeof targetUrl !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // Only ever shorten our own pages — never let this become an open
  // redirect for arbitrary third-party URLs.
  let parsed: URL;
  try {
    parsed = new URL(targetUrl, siteUrl);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }
  const allowedOrigin = new URL(siteUrl).origin;
  if (parsed.origin !== allowedOrigin) {
    return NextResponse.json({ error: "Only links on this site can be shortened" }, { status: 400 });
  }

  try {
    const code = await createShortLink(parsed.pathname + parsed.search);
    return NextResponse.json({ shortUrl: `${siteUrl}/s/${code}` });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create short link" },
      { status: 502 }
    );
  }
}
