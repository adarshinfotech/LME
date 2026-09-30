/**
 * Illustrative revenue model from the partner programme document
 * (section 6, "Franchisee Revenue Examples"). These are examples only —
 * never guarantees. Figures are revenue before partner expenses and taxes.
 */
export const REVENUE_MODEL = {
  partnerShare: 0.6,
  lmiShare: 0.4,
  /** Illustrative average SaaS value per customer per month used by the document's examples. */
  illustrativeAvgPerClient: 5000,
  minClients: 10,
  maxClients: 100,
  milestones: [10, 25, 50, 100],
} as const;

export type RevenueScenario = {
  clients: number;
  grossMrr: number;
  partnerMonthly: number;
  lmiMonthly: number;
  partnerAnnual: number;
};

export function revenueScenario(clients: number): RevenueScenario {
  const grossMrr = clients * REVENUE_MODEL.illustrativeAvgPerClient;
  const partnerMonthly = grossMrr * REVENUE_MODEL.partnerShare;
  return {
    clients,
    grossMrr,
    partnerMonthly,
    lmiMonthly: grossMrr - partnerMonthly,
    partnerAnnual: partnerMonthly * 12,
  };
}

export const REVENUE_DISCLAIMER =
  "Illustrative revenue examples only. Actual revenue depends on customer acquisition, product mix, pricing, retention and operating costs.";
