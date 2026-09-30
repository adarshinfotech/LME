export type Step = { title: string; body: string };

export const journey: Step[] = [
  { title: "Apply", body: "Tell us about yourself and your business goals." },
  { title: "Connect", body: "Our partnership team reviews your application and contacts you." },
  { title: "Discuss", body: "Understand your market and business plan." },
  { title: "Onboard", body: "Complete the partner onboarding process." },
  { title: "Launch", body: "Access products, demos, training and sales resources." },
  { title: "Sell", body: "Generate leads and present relevant solutions." },
  { title: "Grow", body: "Build your customer base and recurring revenue." },
  { title: "Scale", body: "Upsell products, AI, integrations and services." },
];

export const responsibilities = [
  { title: "You focus on", items: ["Sales", "Relationships", "Market", "Customers", "Growth"] },
  { title: "LMI provides", items: ["Technology", "Products", "Infrastructure", "Updates", "Technical support"] },
  { title: "Together", items: ["Acquire", "Onboard", "Grow", "Upsell", "Scale"] },
] as const;
