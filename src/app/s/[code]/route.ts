import { NextRequest, NextResponse } from "next/server";
import { resolveShortLink, isShortenerConfigured } from "@/lib/utils/shortener";
import { siteUrl } from "@/lib/utils/site-url";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  if (!isShortenerConfigured) {
    return NextResponse.redirect(new URL("/", siteUrl));
  }

  const target = await resolveShortLink(code).catch(() => null);
  if (!target) {
    return NextResponse.redirect(new URL("/?expired=1", siteUrl));
  }

  return NextResponse.redirect(new URL(target, siteUrl));
}
