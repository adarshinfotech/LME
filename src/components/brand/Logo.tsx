import { LETS_MAKE_IT_WORDMARK, LMI_MARK } from "./paths";

/** Pass `title=""` when the mark is decorative (e.g. inside a labelled link). */
type SvgProps = { className?: string; title?: string };

const a11y = (title: string) => (title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const });

/** The LMI mark, rendered in `currentColor` so it adapts to light and dark surfaces. */
export function LmiMark({ className, title = "LMI" }: SvgProps) {
  return (
    <svg viewBox={LMI_MARK.viewBox} className={className} fill="currentColor" {...a11y(title)}>
      <path fillRule="evenodd" d={LMI_MARK.d} />
    </svg>
  );
}

/** The "Let's Make It" wordmark. */
export function LetsMakeItWordmark({ className, title = "Let's Make It" }: SvgProps) {
  return (
    <svg viewBox={LETS_MAKE_IT_WORDMARK.viewBox} className={className} fill="currentColor" {...a11y(title)}>
      <path fillRule="evenodd" d={LETS_MAKE_IT_WORDMARK.d} />
    </svg>
  );
}
