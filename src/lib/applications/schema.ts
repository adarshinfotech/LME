import { z } from "zod";
import {
  ACQUISITION_METHODS,
  APPLICANT_TYPES,
  BUSINESS_STATUS,
  SALES_EXPERIENCE,
  START_TIMELINES,
  TARGET_CUSTOMERS,
  values,
} from "./options";

// No runtime code generation: keeps the site compatible with a strict CSP (no 'unsafe-eval').
z.config({ jitless: true });

const text = (min: number, max: number, label: string) =>
  z
    .string({ error: `Please enter your ${label}.` })
    .trim()
    .min(min, min <= 1 ? `Please enter your ${label}.` : `Please enter at least ${min} characters.`)
    .max(max, `Please keep this under ${max} characters.`);

/** Strip spaces, dashes and brackets; accept Indian mobiles or E.164. */
export function normalizeMobile(raw: string) {
  const compact = raw.replace(/[\s\-().]/g, "");
  if (/^[6-9]\d{9}$/.test(compact)) return `+91${compact}`;
  if (/^0[6-9]\d{9}$/.test(compact)) return `+91${compact.slice(1)}`;
  if (/^91[6-9]\d{9}$/.test(compact)) return `+${compact}`;
  return compact;
}

const mobile = z
  .string({ error: "Please enter your mobile number." })
  .trim()
  .min(1, "Please enter your mobile number.")
  .transform(normalizeMobile)
  .refine((v) => /^\+91[6-9]\d{9}$/.test(v) || /^\+[1-9]\d{9,14}$/.test(v), "Please enter a valid mobile number.");

const choice = <T extends string>(options: [T, ...T[]], message: string) => z.enum(options, { error: message });

const multi = <T extends string>(options: [T, ...T[]], message: string) =>
  z.array(z.enum(options), { error: message }).min(1, message).max(options.length);

export const stepSchemas = [
  z.object({
    fullName: text(2, 120, "full name"),
    mobile,
    email: z
      .string({ error: "Please enter your email address." })
      .trim()
      .toLowerCase()
      .max(254, "Please enter a valid email address.")
      .pipe(z.email("Please enter a valid email address.")),
    city: text(2, 80, "city"),
    state: text(2, 80, "state"),
  }),
  z.object({
    applicantType: choice(values(APPLICANT_TYPES), "Please choose what best describes you."),
    businessStatus: choice(values(BUSINESS_STATUS), "Please tell us whether you run a business."),
    salesExperience: choice(values(SALES_EXPERIENCE), "Please choose your sales experience."),
  }),
  z.object({
    targetCustomers: multi(values(TARGET_CUSTOMERS), "Please choose at least one customer type."),
    targetLocation: text(2, 160, "target location"),
  }),
  z.object({
    acquisitionMethods: multi(values(ACQUISITION_METHODS), "Please choose at least one approach."),
    startTimeline: choice(values(START_TIMELINES), "Please choose when you would like to start."),
  }),
  z.object({
    businessGoal: z
      .string({ error: "Please tell us about your goal." })
      .trim()
      .min(20, "Please share a little more — at least 20 characters.")
      .max(3000, "Please keep this under 3,000 characters."),
    consent: z.literal(true, { error: "Please confirm we may contact you about your application." }),
  }),
] as const;

export const applicationSchema = stepSchemas[0]
  .extend(stepSchemas[1].shape)
  .extend(stepSchemas[2].shape)
  .extend(stepSchemas[3].shape)
  .extend(stepSchemas[4].shape);

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationDraft = Partial<{ [K in keyof ApplicationInput]: z.input<typeof applicationSchema>[K] }>;
export type FieldErrors = Partial<Record<keyof ApplicationInput, string>>;

/** Submission envelope: the application plus anti-abuse fields. */
export const submissionSchema = z.object({
  application: z.unknown(),
  /** Honeypot — real users never see or fill it. */
  website: z.string().max(200).optional(),
  /** ms timestamp when the form was first rendered. */
  startedAt: z.number().int().positive(),
  turnstileToken: z.string().max(4096).optional(),
});

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ApplicationInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export const APPLICATION_NUMBER_RE = /^LMI-[A-Z0-9]{6}$/;
