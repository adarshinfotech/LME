import { cn } from "@/lib/cn";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: (a11y: { id: string; "aria-invalid": boolean; "aria-describedby"?: string; "aria-required"?: boolean }) => React.ReactNode;
};

export const inputClass =
  "block w-full border-0 border-b border-ink/25 bg-transparent px-0 pb-3 pt-2 text-lg text-ink placeholder:text-muted/60 transition-colors duration-300 focus:border-ink focus:outline-none focus:ring-0 aria-[invalid=true]:border-danger";

/** Label + control + hint/error, wired together for assistive technology. */
export function ApplicationField({ id, label, error, hint, required, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("group", className)}>
      <label htmlFor={id} className="eyebrow block text-[0.68rem] text-muted transition-colors group-focus-within:text-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-ink">
            *
          </span>
        ) : null}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required || undefined })}
      {hint && !error ? (
        <p id={hintId} className="mt-2 text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
