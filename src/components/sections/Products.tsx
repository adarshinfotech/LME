"use client";

import { m, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { products } from "@/content/products";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionView } from "@/components/motion/SectionView";
import { Arrow } from "@/components/ui/Arrow";
import { ProductCard } from "./ProductCard";

const CARD = "w-[82vw] shrink-0 sm:w-[24rem] lg:w-[26rem] h-[min(32rem,60vh)] min-h-[27rem]";
const PINNED_QUERY = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Desktop: the section pins while vertical scroll drives a horizontal track.
 * Touch / small screens / reduced motion: a native swipeable rail with snap.
 */
export function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia(PINNED_QUERY);
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!pinned || !trackRef.current) return;
    const track = trackRef.current;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [pinned]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const { scrollXProgress } = useScroll({ container: railRef });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const progress = pinned ? scrollYProgress : scrollXProgress;

  const cards = (
    <>
      {products.map((p, i) => (
        <div key={p.slug} className={CARD}>
          <ProductCard product={p} index={i} total={products.length} />
        </div>
      ))}
      <div className={CARD}>
        <Link
          href="/solutions"
          className="group flex h-full flex-col justify-between border border-sand/80 bg-sand p-7 text-ink transition-colors duration-700 hover:bg-white sm:p-9"
        >
          <span className="eyebrow text-[0.62rem] text-muted">Full portfolio</span>
          <span className="font-display text-[2.25rem] leading-[1.05] tracking-[-0.02em]">
            Explore every
            <br />
            solution
          </span>
          <span className="flex items-center justify-between border-t border-line pt-4 text-sm uppercase tracking-[0.16em]">
            View solutions
            <Arrow className="size-5 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </>
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="products-title"
      className="relative bg-ink text-sand"
      data-theme="dark"
      style={pinned && distance ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <SectionView event="solutions_view" className="h-full">
        <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "section-y"}>
          <div
            className={`container-lux flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between ${pinned ? "pt-[calc(var(--nav-h)+1.5rem)]" : ""}`}
          >
            <SectionHeading
              id="products-title"
              tone="dark"
              eyebrow="Product portfolio"
              title={["One partnership.", "Multiple business solutions."]}
            />
            <p className="max-w-xs text-sm leading-relaxed text-stone lg:pb-3 lg:text-right">
              {pinned ? "Scroll to explore the portfolio." : "Swipe to explore the portfolio."}
            </p>
          </div>

          {pinned ? (
            <m.div
              ref={trackRef}
              style={{ x }}
              className="mt-12 flex gap-5 pl-[max(3rem,calc((100vw-88rem)/2+3rem))] pr-12 will-change-transform"
            >
              {cards}
            </m.div>
          ) : (
            <div
              ref={railRef}
              className="rail mt-12 flex gap-4 overflow-x-auto px-5 pb-2 sm:gap-5 sm:px-8"
              tabIndex={0}
              role="region"
              aria-label="Product portfolio, scroll horizontally"
            >
              {cards}
            </div>
          )}

          <div className="container-lux mt-10">
            <div className="h-px w-full bg-line-dark" aria-hidden="true">
              <m.div className="h-px bg-sand" style={{ scaleX: progress, originX: 0 }} />
            </div>
          </div>
        </div>
      </SectionView>
    </section>
  );
}
