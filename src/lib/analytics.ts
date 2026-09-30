/**
 * First-party, privacy-light analytics. Events go to `window.dataLayer`
 * (for any tag manager configured later) and to our own /api/track endpoint,
 * which feeds the funnel on the admin dashboard. No personal data is sent.
 */
export const ANALYTICS_EVENTS = [
  "page_view",
  "hero_apply_click",
  "apply_click",
  "solutions_view",
  "revenue_section_view",
  "apply_page_view",
  "application_started",
  "application_completed",
  "application_abandoned",
] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];
export type AnalyticsProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

const SESSION_KEY = "lmi_sid";

function sessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

export function track(name: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (navigator.doNotTrack === "1") return;

  (window.dataLayer ??= []).push({ event: name, ...props });

  const body = JSON.stringify({
    name,
    props,
    path: window.location.pathname,
    sessionId: sessionId(),
  });

  try {
    const blob = new Blob([body], { type: "application/json" });
    if (!navigator.sendBeacon?.("/api/track", blob)) {
      void fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } });
    }
  } catch {
    // Analytics must never break the experience.
  }
}
