import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

export function clientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

/** One-way hash so raw IP addresses are never stored. */
export function hashIp(ip: string) {
  return createHash("sha256").update(`${env.ipHashSalt}:${ip}`).digest("hex").slice(0, 40);
}

/** Reject cross-site form posts. Requests without an Origin header (older clients, beacons) are allowed. */
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function readJson(request: Request, maxBytes: number): Promise<unknown | null> {
  const text = await request.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!env.turnstileSecret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.turnstileSecret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
