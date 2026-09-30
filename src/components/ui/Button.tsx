"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";
import { Magnetic } from "@/components/motion/Magnetic";
import { Arrow } from "./Arrow";

type Variant = "primary" | "outline" | "light" | "outline-light" | "text";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap font-medium uppercase tracking-[0.16em] transition-colors duration-500 ease-[var(--ease-lux)] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-sand hover:bg-carbon",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-sand",
  light: "bg-sand text-ink hover:bg-white",
  "outline-light": "border border-sand/40 text-sand hover:border-sand hover:bg-sand hover:text-ink",
  text: "text-ink underline-offset-8 hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-12 px-6 text-[0.72rem]",
  lg: "h-14 px-8 text-[0.76rem] sm:h-16 sm:px-10",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  children: React.ReactNode;
  trackEvent?: AnalyticsEvent;
  trackProps?: AnalyticsProps;
};

type LinkButtonProps = CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href" | "className" | "children"
  >;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

function Inner({ children, arrow }: { children: React.ReactNode; arrow?: boolean }) {
  return (
    <>
      <span className="relative">{children}</span>
      {arrow ? (
        <span className="relative inline-flex overflow-hidden" aria-hidden="true">
          <Arrow className="size-4 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-5" />
          <Arrow className="absolute size-4 -translate-x-5 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-0" />
        </span>
      ) : null}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, LinkButtonProps | NativeButtonProps>(function Button(props, ref) {
  const { variant = "primary", size = "md", arrow, magnetic, className, children, trackEvent, trackProps, ...rest } = props;
  const classes = cn(base, variants[variant], variant !== "text" && sizes[size], className);

  let node: React.ReactNode;
  if (rest.href !== undefined) {
    const { href, onClick, ...anchor } = rest as LinkButtonProps;
    node = (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={(e) => {
          if (trackEvent) track(trackEvent, trackProps);
          onClick?.(e);
        }}
        {...anchor}
      >
        <Inner arrow={arrow}>{children}</Inner>
      </Link>
    );
  } else {
    const { onClick, type = "button", ...button } = rest as NativeButtonProps;
    node = (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={classes}
        onClick={(e) => {
          if (trackEvent) track(trackEvent, trackProps);
          onClick?.(e);
        }}
        {...button}
      >
        <Inner arrow={arrow}>{children}</Inner>
      </button>
    );
  }

  return magnetic ? <Magnetic>{node}</Magnetic> : node;
});
