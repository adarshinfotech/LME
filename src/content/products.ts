export type Product = {
  slug: string;
  name: string;
  summary: string;
  capabilities: string[];
  /** Short category label shown on the card. */
  category: string;
};

// Scope from the partner programme document. Pricing is intentionally
// excluded from every public data model.
export const products: Product[] = [
  {
    slug: "crm",
    name: "CRM",
    category: "Sales",
    summary: "Capture every lead and move each deal forward with clarity.",
    capabilities: ["Sales", "Leads", "Pipeline", "Follow-ups", "Customer management"],
  },
  {
    slug: "hr",
    name: "HR Management",
    category: "People",
    summary: "Run everyday people operations from one organised system.",
    capabilities: ["Employees", "Attendance", "Leave", "Payroll & HR workflows"],
  },
  {
    slug: "inventory",
    name: "Inventory Management",
    category: "Operations",
    summary: "Know what is in stock, where it is and what is moving.",
    capabilities: ["Stock", "Purchases", "Sales", "Warehouses", "Reports"],
  },
  {
    slug: "workshop",
    name: "Workshop Management",
    category: "Service",
    summary: "Organise service jobs from vehicle intake to final billing.",
    capabilities: ["Job cards", "Vehicles", "Service history", "Parts", "Billing"],
  },
  {
    slug: "gym",
    name: "Gym Management",
    category: "Fitness",
    summary: "Manage members, plans and renewals without the paperwork.",
    capabilities: ["Members", "Plans", "Attendance", "Renewals", "Payments"],
  },
  {
    slug: "hostel",
    name: "Hostel Management",
    category: "Residential",
    summary: "Allocate rooms, track residents and manage fees in one place.",
    capabilities: ["Rooms & beds", "Residents", "Fees", "Allocation", "Reports"],
  },
  {
    slug: "erp",
    name: "ERP",
    category: "Enterprise",
    summary: "Connect the core operations of a growing business.",
    capabilities: ["Core operations", "Inventory", "Purchase", "Sales", "Reports"],
  },
  {
    slug: "construction-erp",
    name: "Construction ERP",
    category: "Construction",
    summary: "Keep projects, sites and materials under control.",
    capabilities: ["Projects", "Sites", "Materials", "Labour", "Expenses", "Progress"],
  },
  {
    slug: "manufacturing-erp",
    name: "Manufacturing ERP",
    category: "Manufacturing",
    summary: "Plan production and track materials from input to output.",
    capabilities: ["Production", "Bill of materials", "Raw material", "Stock", "Wastage", "Reports"],
  },
  {
    slug: "ai-automation",
    name: "AI Automation",
    category: "Intelligence",
    summary: "Automate repetitive work with AI workflows and assistants.",
    capabilities: ["AI workflows", "Email automation", "Reporting", "Assistants"],
  },
];
