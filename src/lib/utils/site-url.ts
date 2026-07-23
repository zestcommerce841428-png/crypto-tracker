// Prefer an explicit custom domain if set; otherwise fall back to Vercel's
// auto-injected production URL, then its per-deployment URL, so metadata
// (OG images, canonical links, sitemap, robots.txt) always resolves to
// wherever this build is actually running instead of a hardcoded placeholder.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ??
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
  "http://localhost:3000";
