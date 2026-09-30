import { cn } from "@/lib/cn";
import { WordReveal } from "@/components/motion/WordReveal";
import { Reveal } from "@/components/motion/Reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  /** Each entry becomes a line of the headline. */
  title: string[];
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  size?: "md" | "lg";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  size = "md",
  as = "h2",
  className,
  id,
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <header className={cn("max-w-5xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal y={12}>
          <p
            className={cn(
              "eyebrow mb-6 flex items-center gap-3",
              align === "center" && "justify-center",
              dark ? "text-stone" : "text-muted",
            )}
          >
            <span aria-hidden="true" className={cn("h-px w-8", dark ? "bg-stone" : "bg-muted")} />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <WordReveal
        as={as}
        id={id}
        lines={title}
        className={cn(
          "font-display font-normal text-balance",
          size === "lg" ? "text-display-lg" : "text-display-md",
          dark ? "text-sand" : "text-ink",
        )}
      />
      {intro ? (
        <Reveal delay={0.2}>
          <p
            className={cn(
              "mt-8 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl",
              align === "center" && "mx-auto",
              dark ? "text-stone" : "text-muted",
            )}
          >
            {intro}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
