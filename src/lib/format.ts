const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** ₹1,25,000 — Indian digit grouping. */
export function formatINR(value: number) {
  return `₹${inr.format(Math.round(value))}`;
}

/** ₹9.00 lakh — used for annual figures, mirroring the source document. */
export function formatLakh(value: number) {
  return `₹${(value / 100000).toFixed(2)} lakh`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}
