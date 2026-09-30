"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void; theme?: string },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Optional Cloudflare Turnstile challenge, rendered only when configured. */
export function Turnstile({ onToken }: { onToken: (token: string | undefined) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY) return;
    let timer = 0;
    const mount = () => {
      if (!ref.current || !window.turnstile || widget.current) return;
      window.clearInterval(timer);
      widget.current = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        theme: "light",
        callback: (t) => onToken(t),
        "expired-callback": () => onToken(undefined),
      });
    };
    timer = window.setInterval(mount, 300);
    mount();
    return () => {
      window.clearInterval(timer);
      if (widget.current) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [onToken]);

  if (!SITE_KEY) return null;
  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />
      <div ref={ref} className="min-h-[65px]" />
    </>
  );
}

export const turnstileEnabled = Boolean(SITE_KEY);
