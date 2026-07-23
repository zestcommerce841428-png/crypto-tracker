import type { NextConfig } from "next";

// Emotion (MUI's styling engine) and Next's own hydration bootstrap both
// rely on inline <script>/<style> tags, so a strict nonce-based CSP would
// need per-request middleware wiring; this is the pragmatic middle ground
// used by most production Next+MUI apps — 'unsafe-inline' scoped only to
// script/style, with every other directive locked down (no plugins, no
// framing, no arbitrary origins).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://coin-images.coingecko.com https://assets.coingecko.com https://*.coingecko.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.coingecko.com https://api.binance.com wss://stream.binance.com https://api.alternative.me https://mempool.space https://api.etherscan.io https://min-api.cryptocompare.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "coin-images.coingecko.com" },
      { protocol: "https", hostname: "assets.coingecko.com" },
      { protocol: "https", hostname: "*.coingecko.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  // Pages that fan out into several sequential CoinGecko calls (sitemap,
  // exchanges, derivatives) can take longer than the 60s default under the
  // free-tier's rate limiting/retries.
  staticPageGenerationTimeout: 180,
  experimental: {
    // Each static-generation worker is a separate process with its own
    // in-memory request throttle (src/lib/api/coingecko.ts), so parallel
    // workers can't see each other's outbound requests. 2 workers still
    // doubled CoinGecko's real observed free-tier limit and kept 429ing,
    // so this funnels the entire build through a single throttled queue.
    cpus: 1,
  },
};

export default nextConfig;
