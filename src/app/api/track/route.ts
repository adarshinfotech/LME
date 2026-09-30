import { z } from "zod";
import { ANALYTICS_EVENTS } from "@/lib/analytics";
import { getPublicStore } from "@/lib/data";
import { rateLimit } from "@/lib/security/rate-limit";
import { clientIp, hashIp, readJson, sameOrigin } from "@/lib/security/request";

export const dynamic = "force-dynamic";

const eventSchema = z.object({
  name: z.enum(ANALYTICS_EVENTS),
  sessionId: z.string().min(1).max(64),
  path: z.string().max(256),
  props: z
    .record(z.string().max(40), z.union([z.string().max(120), z.number(), z.boolean()]))
    .refine((p) => Object.keys(p).length <= 10)
    .default({}),
});

const accepted = () => new Response(null, { status: 204 });

export async function POST(request: Request) {
  const store = getPublicStore();
  if (!store || !sameOrigin(request)) return accepted();

  if (!rateLimit(`track:${hashIp(clientIp(request.headers))}`, 120, 60_000).ok) return accepted();

  const parsed = eventSchema.safeParse(await readJson(request, 4_000));
  if (!parsed.success) return new Response(null, { status: 400 });

  try {
    await store.recordEvent(parsed.data);
  } catch {
    // Analytics failures are never surfaced to visitors.
  }
  return accepted();
}
