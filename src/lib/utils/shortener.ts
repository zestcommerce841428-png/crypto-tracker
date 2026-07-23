import "server-only";
import { Redis } from "@upstash/redis";

// Real, persistent short links backed by Upstash Redis (provisioned via
// Vercel's marketplace). Degrades gracefully — with no KV env vars present
// (e.g. before the integration is set up), short-link creation simply
// reports itself unavailable instead of crashing; every other feature on
// the site works independently of this.
const KV_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const isShortenerConfigured = Boolean(KV_URL && KV_TOKEN);

let redis: Redis | null = null;
function getRedis(): Redis {
  if (!redis) {
    if (!KV_URL || !KV_TOKEN) {
      throw new Error("Short-link storage is not configured");
    }
    redis = new Redis({ url: KV_URL, token: KV_TOKEN });
  }
  return redis;
}

const CODE_CHARS = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/l/I
const CODE_LENGTH = 7;
const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

function randomCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
}

export async function createShortLink(targetUrl: string): Promise<string> {
  const client = getRedis();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    // NX-style: only set if not already taken, so concurrent requests can't collide.
    const set = await client.set(`shorturl:${code}`, targetUrl, {
      nx: true,
      ex: TTL_SECONDS,
    });
    if (set) return code;
  }
  throw new Error("Failed to generate a unique short code");
}

export async function resolveShortLink(code: string): Promise<string | null> {
  const client = getRedis();
  return client.get<string>(`shorturl:${code}`);
}
