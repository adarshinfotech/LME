import { describe, expect, it } from "vitest";
import { rateLimit } from "@/lib/security/rate-limit";

describe("rateLimit", () => {
  it("allows up to the limit, then blocks until the window resets", () => {
    const t = 1_000_000;
    for (let i = 0; i < 3; i++) expect(rateLimit("k", 3, 1000, t).ok).toBe(true);
    const blocked = rateLimit("k", 3, 1000, t + 10);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBe(1);
    expect(rateLimit("k", 3, 1000, t + 1001).ok).toBe(true);
  });

  it("tracks keys independently", () => {
    expect(rateLimit("a", 1, 1000, 5).ok).toBe(true);
    expect(rateLimit("b", 1, 1000, 5).ok).toBe(true);
    expect(rateLimit("a", 1, 1000, 6).ok).toBe(false);
  });
});
