import { describe, expect, it } from "vitest";
import { formatINR, formatLakh } from "@/lib/format";
import { revenueScenario } from "@/lib/revenue";

// Figures from the partner programme document, section 6.
describe("revenueScenario", () => {
  it.each([
    [10, "₹50,000", "₹30,000", "₹3.60 lakh"],
    [25, "₹1,25,000", "₹75,000", "₹9.00 lakh"],
    [50, "₹2,50,000", "₹1,50,000", "₹18.00 lakh"],
    [100, "₹5,00,000", "₹3,00,000", "₹36.00 lakh"],
  ])("%i clients", (clients, gross, partner, annual) => {
    const s = revenueScenario(clients);
    expect(formatINR(s.grossMrr)).toBe(gross);
    expect(formatINR(s.partnerMonthly)).toBe(partner);
    expect(formatLakh(s.partnerAnnual)).toBe(annual);
    expect(s.partnerMonthly + s.lmiMonthly).toBe(s.grossMrr);
  });
});
