import type { Option } from "@/lib/applications/options";
import { cn } from "@/lib/cn";

type ChoiceGroupProps = {
  name: string;
  legend: string;
  options: readonly Option[];
  error?: string;
  hint?: string;
  columns?: 2 | 3;
} & (
  | { multiple: true; value: string[]; onChange: (value: string[]) => void }
  | { multiple?: false; value: string | undefined; onChange: (value: string) => void }
);

/** Accessible radio / checkbox group rendered as selectable tiles. */
export function ChoiceGroup(props: ChoiceGroupProps) {
  const { name, legend, options, error, hint, columns = 2 } = props;
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;

  const isChecked = (v: string) => (props.multiple ? props.value.includes(v) : props.value === v);
  const toggle = (v: string) => {
    if (props.multiple) {
      props.onChange(props.value.includes(v) ? props.value.filter((x) => x !== v) : [...props.value, v]);
    } else {
      props.onChange(v);
    }
  };

  return (
    <fieldset
      aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
      aria-invalid={Boolean(error)}
      id={`${name}-group`}
    >
      <legend className="eyebrow mb-4 text-[0.68rem] text-muted">
        {legend}
        <span aria-hidden="true" className="ml-1 text-ink">
          *
        </span>
      </legend>
      {hint ? (
        <p id={hintId} className="-mt-2 mb-4 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      <div className={cn("grid gap-2 sm:gap-3", columns === 3 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2")}>
        {options.map((o, i) => {
          const checked = isChecked(o.value);
          const id = `${name}-${o.value}`;
          return (
            <label
              key={o.value}
              htmlFor={id}
              className={cn(
                "relative flex min-h-14 cursor-pointer items-center justify-between gap-3 border px-4 py-3 text-[0.95rem] leading-snug transition-colors duration-300",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
                checked ? "border-ink bg-ink text-sand" : "border-ink/20 hover:border-ink/60",
                error && !checked && "border-danger/50",
              )}
            >
              <input
                id={id}
                type={props.multiple ? "checkbox" : "radio"}
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => toggle(o.value)}
                className="sr-only"
                data-first={i === 0 ? "true" : undefined}
              />
              <span>{o.label}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center border transition-colors",
                  props.multiple ? "" : "rounded-full",
                  checked ? "border-sand" : "border-ink/40",
                )}
              >
                {checked ? <span className={cn("size-2 bg-sand", props.multiple ? "" : "rounded-full")} /> : null}
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={errorId} className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
