/**
 * Public site configuration.
 *
 * Contact details are read from env so no phone number or address is ever
 * hard-coded or invented. Anything left unset is simply not rendered.
 */
export const site = {
  name: "LMI",
  fullName: "Let's Make It",
  poweredBy: "Adarsh Infotech",
  tagline: "Your Brand. Our Technology.",
  title: "LMI — Start Your Own Software Business",
  description:
    "Build your own software business with LMI. Access business software solutions, technology infrastructure and a partner revenue model powered by Adarsh Infotech.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  },
} as const;

/**
 * Partner fee shown publicly. `listPrice` is an optional official "was" price
 * and stays null (hidden) unless explicitly configured by the business.
 * Renewal and product pricing are intentionally absent from public config.
 */
export const partnerOffer = {
  label: "Special Launch Offer",
  amount: "₹2,49,000",
  taxNote: "+ GST",
  description: "One-time Partner Fee",
  listPrice: process.env.NEXT_PUBLIC_PARTNER_LIST_PRICE || null,
  studentNote: "Special discounts available for student entrepreneurs.",
} as const;

export const mainNav = [
  { href: "/solutions", label: "Solutions" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/partner", label: "Opportunity" },
] as const;
