import { describe, expect, it } from "vitest";
import { applicationSchema, flattenErrors, normalizeMobile, stepSchemas } from "@/lib/applications/schema";

const valid = {
  fullName: "Asha K",
  mobile: "98765 43210",
  email: " ASHA@Example.com ",
  city: "Coimbatore",
  state: "Tamil Nadu",
  applicantType: "student",
  businessStatus: "planning",
  salesExperience: "none",
  targetCustomers: ["gyms", "retailers"],
  targetLocation: "Coimbatore district",
  acquisitionMethods: ["referrals"],
  startTimeline: "within_30_days",
  businessGoal: "I want to build a software business for gyms in my city.",
  consent: true,
};

describe("applicationSchema", () => {
  it("accepts a complete application and normalises contact details", () => {
    const r = applicationSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.mobile).toBe("+919876543210");
      expect(r.data.email).toBe("asha@example.com");
    }
  });

  it("rejects invalid values with human-readable messages", () => {
    const r = applicationSchema.safeParse({
      ...valid,
      mobile: "123",
      email: "nope",
      applicantType: "alien",
      targetCustomers: [],
      businessGoal: "short",
      consent: false,
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const e = flattenErrors(r.error);
      expect(e.mobile).toBe("Please enter a valid mobile number.");
      expect(e.email).toBe("Please enter a valid email address.");
      expect(e.applicantType).toBe("Please choose what best describes you.");
      expect(e.targetCustomers).toBe("Please choose at least one customer type.");
      expect(e.businessGoal).toMatch(/at least 20/);
      expect(e.consent).toMatch(/contact you/);
    }
  });

  it("rejects unknown option codes that are not in the database constraint list", () => {
    expect(applicationSchema.safeParse({ ...valid, acquisitionMethods: ["carrier_pigeon"] }).success).toBe(false);
  });

  it("validates each step independently", () => {
    const r = stepSchemas[0].safeParse({});
    expect(r.success).toBe(false);
    if (!r.success) expect(Object.keys(flattenErrors(r.error)).sort()).toEqual(["city", "email", "fullName", "mobile", "state"]);
  });
});

describe("normalizeMobile", () => {
  it.each([
    ["9876543210", "+919876543210"],
    ["09876543210", "+919876543210"],
    ["91 98765-43210", "+919876543210"],
    ["+91 98765 43210", "+919876543210"],
    ["+44 7700 900123", "+447700900123"],
  ])("%s → %s", (input, out) => expect(normalizeMobile(input)).toBe(out));
});
