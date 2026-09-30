/**
 * Application form options. Codes are stored in the database (and enforced
 * by check constraints in the migration); labels are for display only.
 */
export type Option<T extends string = string> = { value: T; label: string };

const opts = <T extends string>(o: readonly Option<T>[]) => o;

export const APPLICANT_TYPES = opts([
  { value: "student", label: "Student Entrepreneur" },
  { value: "business_owner", label: "Business Owner" },
  { value: "consultant", label: "Freelancer / Consultant" },
  { value: "sales_professional", label: "Sales Professional" },
  { value: "it_professional", label: "IT Professional" },
  { value: "founder", label: "Entrepreneur / Startup Founder" },
  { value: "other", label: "Other" },
] as const);

export const BUSINESS_STATUS = opts([
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "planning", label: "Planning to start one" },
] as const);

export const SALES_EXPERIENCE = opts([
  { value: "lt_1", label: "Less than 1 year" },
  { value: "1_3", label: "1–3 years" },
  { value: "3_plus", label: "3+ years" },
  { value: "none", label: "No experience" },
] as const);

export const TARGET_CUSTOMERS = opts([
  { value: "small_businesses", label: "Small Businesses" },
  { value: "retailers", label: "Retailers" },
  { value: "manufacturers", label: "Manufacturers" },
  { value: "workshops", label: "Workshops" },
  { value: "gyms", label: "Gyms" },
  { value: "hostels", label: "Hostels" },
  { value: "construction", label: "Construction Companies" },
  { value: "institutions", label: "Institutions" },
  { value: "other", label: "Other" },
] as const);

export const ACQUISITION_METHODS = opts([
  { value: "direct_sales", label: "Direct Sales" },
  { value: "existing_network", label: "Existing Network" },
  { value: "digital_marketing", label: "Digital Marketing" },
  { value: "referrals", label: "Referrals" },
  { value: "social_media", label: "Social Media" },
  { value: "sales_team", label: "Sales Team" },
  { value: "other", label: "Other" },
] as const);

export const START_TIMELINES = opts([
  { value: "immediately", label: "Immediately" },
  { value: "within_30_days", label: "Within 30 days" },
  { value: "1_3_months", label: "1–3 months" },
  { value: "exploring", label: "Just exploring" },
] as const);

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const values = <T extends string>(o: readonly Option<T>[]) => o.map((x) => x.value) as [T, ...T[]];

export function labelFor(o: readonly Option[], value: string) {
  return o.find((x) => x.value === value)?.label ?? value;
}
