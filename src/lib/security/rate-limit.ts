/**
 * Fixed-window, in-memory rate limiter. Per server instance — a first line
 * of defence that is backed by database-level checks for applications.
 */
type Bucket = { count: number; resetAt: number };
const g = globalThis as unknown as { __lmiRateBuckets?: Map<string, Bucket> };
const buckets = (g.__lmiRateBuckets ??= new Map());

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (buckets.size > 10000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count++;
  if (bucket.count > limit) return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  return { ok: true, retryAfter: 0 };
}
