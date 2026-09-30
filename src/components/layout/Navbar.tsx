"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LmiMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { mainNav, site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on navigation.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      // Sample what sits just under the bar so it can match dark sections.
      const probeY = document.querySelector("header")?.getBoundingClientRect().bottom ?? 72;
      const under = document.elementsFromPoint(window.innerWidth / 2, probeY + 1).find((el) => !el.closest("header"));
      setOverDark(Boolean(under?.closest('[data-theme="dark"]')));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = scrolled || open;
  const dark = overDark && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-lux)]",
        solid && !open
          ? dark
            ? "border-b border-sand/10 bg-ink/85 text-sand backdrop-blur-xl"
            : "border-b border-ink/10 bg-sand/85 backdrop-blur-xl"
          : "border-b border-transparent",
        dark ? "text-sand" : "text-ink",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-sand"
      >
        Skip to content
      </a>
      <nav aria-label="Primary" className="container-lux flex h-[var(--nav-h)] items-center justify-between">
        <Link
          href="/"
          className={cn("relative z-[55] flex items-center gap-3 transition-colors", open && "text-sand")}
          aria-label={`${site.name} — ${site.fullName}, home`}
        >
          <LmiMark className="h-6 w-auto sm:h-7" title="" />
          <span className="eyebrow hidden text-[0.62rem] lg:inline" aria-hidden="true">
            Let&rsquo;s Make It
          </span>
        </Link>

        <ul className="hidden items-center gap-10 md:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="group relative py-2 text-[0.8rem] font-medium uppercase tracking-[0.14em]"
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-[var(--ease-lux)]",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:block">
          <Button
            href="/apply"
            variant={dark ? "light" : "primary"}
            arrow
            magnetic
            trackEvent="apply_click"
            trackProps={{ location: "navbar" }}
          >
            Apply Now
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className={cn("relative z-[55] -mr-2 flex size-12 items-center justify-center md:hidden", open && "text-sand")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="relative block h-3 w-7">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-lux)]",
                open && "translate-y-1.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ease-[var(--ease-lux)]",
                open && "-translate-y-[5px] -rotate-45",
              )}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink px-5 pb-10 pt-[calc(var(--nav-h)+2.5rem)] text-sand md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-2">
              {[{ href: "/", label: "Home" }, ...mainNav].map((item, i) => (
                <li key={item.href} className="overflow-hidden border-b border-line-dark">
                  <m.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between py-5 font-display text-4xl"
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                      <span className="text-xs tracking-[0.2em] text-stone">0{i + 1}</span>
                    </Link>
                  </m.div>
                </li>
              ))}
            </ul>
            <m.div
              className="mt-auto"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button
                href="/apply"
                variant="light"
                size="lg"
                arrow
                className="w-full"
                trackEvent="apply_click"
                trackProps={{ location: "mobile_menu" }}
              >
                Apply Now
              </Button>
              <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-stone">{site.tagline}</p>
            </m.div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
