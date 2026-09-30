import type { Product } from "@/content/products";
import { cn } from "@/lib/cn";

type ProductCardProps = {
  product: Product;
  index: number;
  total: number;
  tone?: "dark" | "light";
  /** Number of capabilities to list; cards in the rail show four. */
  limit?: number;
  className?: string;
};

export function ProductCard({ product, index, total, tone = "dark", limit = 4, className }: ProductCardProps) {
  const dark = tone === "dark";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col justify-between border p-7 transition-[border-color,background-color,transform] duration-700 ease-[var(--ease-lux)] sm:p-9",
        dark
          ? "border-line-dark bg-carbon text-sand hover:-translate-y-1 hover:border-sand/50"
          : "border-line bg-sand text-ink hover:-translate-y-1 hover:border-ink/60",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("eyebrow text-[0.62rem]", dark ? "text-stone" : "text-muted")}>{product.category}</span>
        <span className={cn("font-display text-xs tabular-nums", dark ? "text-stone" : "text-muted")}>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div className="mt-16 sm:mt-24">
        <h3 className="font-display text-[1.9rem] leading-[1.05] tracking-[-0.02em] sm:text-[2.25rem]">{product.name}</h3>
        <p className={cn("mt-4 max-w-[22rem] leading-relaxed", dark ? "text-stone" : "text-muted")}>{product.summary}</p>
      </div>

      <ul className={cn("mt-10 border-t", dark ? "border-line-dark" : "border-line")}>
        {product.capabilities.slice(0, limit).map((c) => (
          <li key={c} className={cn("flex items-center justify-between border-b py-3 text-sm", dark ? "border-line-dark" : "border-line")}>
            {c}
            <span
              aria-hidden="true"
              className="size-1 rounded-full bg-current opacity-40 transition-opacity duration-500 group-hover:opacity-100"
            />
          </li>
        ))}
      </ul>
    </article>
  );
}
