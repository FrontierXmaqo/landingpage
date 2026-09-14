// In-memory fixed-window rate limiter. Scoped to a single server instance:
// it resets on cold start/redeploy and isn't shared across Vercel's
// serverless instances, but it stops the obvious rapid-fire spam bursts a
// single client can send to a single warm instance.
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_KEYS = 5000;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function pruneExpired(now: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  { windowMs = WINDOW_MS, maxRequests = MAX_REQUESTS_PER_WINDOW } = {}
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  pruneExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (bucket.count >= maxRequests) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true };
}

/**
 * Brute-force guard for the admin sign-in form: far tighter than the public
 * form's limit, and keyed per account as well as per IP so a distributed
 * attempt against one mailbox is still throttled.
 */
export const LOGIN_LIMIT = { windowMs: 15 * 60_000, maxRequests: 5 } as const;
