import { NextResponse } from "next/server";
import { applicationSchema, flattenErrors, submissionSchema } from "@/lib/applications/schema";
import { getPublicStore } from "@/lib/data";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp, hashIp, readJson, sameOrigin, verifyTurnstile } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const MIN_FILL_MS = 4000;
const MAX_PER_IP_PER_HOUR = 5;

function error(status: number, message: string, extra?: Record<string, unknown>, headers?: HeadersInit) {
  return NextResponse.json({ ok: false, message, ...extra }, { status, headers });
}

export async function POST(request: Request) {
  const store = getPublicStore();
  if (!store) {
    return error(503, "Applications are temporarily unavailable. Please try again shortly.");
  }
  if (!sameOrigin(request)) return error(403, "This request could not be verified.");

  const ip = clientIp(request.headers);
  const ipHash = hashIp(ip);

  const burst = rateLimit(`apply:${ipHash}`, MAX_PER_IP_PER_HOUR, 60 * 60 * 1000);
  if (!burst.ok) {
    return error(429, "Too many applications from this connection. Please try again later.", undefined, {
      "retry-after": String(burst.retryAfter),
    });
  }

  const body = await readJson(request, 20_000);
  const envelope = submissionSchema.safeParse(body);
  if (!envelope.success) return error(400, "We couldn't read your application. Please try again.");

  const { website, startedAt, turnstileToken } = envelope.data;
  // Honeypot filled, or submitted faster than a person could read the form.
  if (website || Date.now() - startedAt < MIN_FILL_MS) {
    return error(400, "Please take a moment to review your application and submit again.");
  }

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return error(400, "Please complete the verification and submit again.");
  }

  const parsed = applicationSchema.safeParse(envelope.data.application);
  if (!parsed.success) {
    return error(422, "Please check the highlighted fields.", { fieldErrors: flattenErrors(parsed.error) });
  }

  try {
    const signals = await store.abuseSignals(parsed.data, ipHash);
    if (signals.recentFromIp >= MAX_PER_IP_PER_HOUR) {
      return error(429, "Too many applications from this connection. Please try again later.");
    }
    if (signals.duplicate) {
      return error(409, "We've already received a recent application with these contact details. Our partnership team will be in touch.");
    }

    const { applicationNumber } = await store.createApplication(parsed.data, {
      ipHash,
      userAgent: request.headers.get("user-agent") ?? "",
    });
    return NextResponse.json({ ok: true, applicationNumber }, { status: 201 });
  } catch (e) {
    console.error("[apply] submission failed", e);
    return error(500, "We couldn't submit your application right now. Please try again in a moment.");
  }
}
