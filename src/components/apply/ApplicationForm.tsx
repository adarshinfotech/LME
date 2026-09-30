"use client";

import { AnimatePresence, m } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ACQUISITION_METHODS,
  APPLICANT_TYPES,
  BUSINESS_STATUS,
  INDIAN_STATES,
  SALES_EXPERIENCE,
  START_TIMELINES,
  TARGET_CUSTOMERS,
} from "@/lib/applications/options";
import { flattenErrors, stepSchemas, type ApplicationDraft, type ApplicationInput, type FieldErrors } from "@/lib/applications/schema";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ApplicationField, inputClass } from "./ApplicationField";
import { ApplicationStep } from "./ApplicationStep";
import { ChoiceGroup } from "./ChoiceGroup";
import { Turnstile, turnstileEnabled } from "./Turnstile";

export const STEPS = [
  { title: "About you", description: "How our partnership team can reach you." },
  { title: "Your background", description: "Where you are starting from — every background is welcome." },
  { title: "Your market", description: "Who you want to serve, and where." },
  { title: "Your plan", description: "How you intend to find customers, and when." },
  { title: "Your goal", description: "In your own words, what you want to build." },
] as const;

const FIELD_STEP: Record<keyof ApplicationInput, number> = {
  fullName: 0,
  mobile: 0,
  email: 0,
  city: 0,
  state: 0,
  applicantType: 1,
  businessStatus: 1,
  salesExperience: 1,
  targetCustomers: 2,
  targetLocation: 2,
  acquisitionMethods: 3,
  startTimeline: 3,
  businessGoal: 4,
  consent: 4,
};

const DRAFT_KEY = "lmi_application_draft";
const GOAL_MAX = 3000;

type SubmitState = { kind: "idle" } | { kind: "submitting" } | { kind: "error"; message: string };

function loadDraft(): { draft: ApplicationDraft; step: number } | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ApplicationForm({ onStepChange }: { onStepChange?: (step: number) => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [draft, setDraft] = useState<ApplicationDraft>({ targetCustomers: [], acquisitionMethods: [] });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submit, setSubmit] = useState<SubmitState>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const startedAt = useRef(0);
  const started = useRef(false);
  const completed = useRef(false);
  const stepRef = useRef(0);
  const [navigated, setNavigated] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // Restore an unsent draft (per-viewer convenience only).
  useEffect(() => {
    startedAt.current = Date.now();
    const saved = loadDraft();
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from sessionStorage after mount
      setDraft((d) => ({ ...d, ...saved.draft }));
      setStep(Math.min(Math.max(saved.step, 0), STEPS.length - 1));
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    stepRef.current = step;
    onStepChange?.(step);
    if (!hydrated.current) return;
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ draft: { ...draft, consent: undefined }, step }));
    } catch {
      // Storage may be unavailable (private mode); the form still works.
    }
  }, [draft, step, onStepChange]);

  // Abandonment signal: started but left without submitting.
  useEffect(() => {
    const onHide = () => {
      if (started.current && !completed.current) track("application_abandoned", { step: stepRef.current + 1 });
    };
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, []);

  const set = useCallback(<K extends keyof ApplicationInput>(key: K, value: ApplicationDraft[K]) => {
    if (!started.current) {
      started.current = true;
      track("application_started");
    }
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
  }, []);

  function focusFirstError(errs: FieldErrors) {
    const first = Object.keys(errs)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const el =
        document.getElementById(first) ??
        document.querySelector<HTMLElement>(`#${first}-group input`) ??
        document.getElementById(`${first}-group`);
      el?.focus();
    });
  }

  function goTo(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setSubmit({ kind: "idle" });
    setNavigated(true);
    requestAnimationFrame(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function validateStep(i: number) {
    const result = stepSchemas[i].safeParse(draft);
    if (result.success) return true;
    const errs = flattenErrors(result.error);
    setErrors(errs);
    focusFirstError(errs);
    return false;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      if (validateStep(step)) goTo(step + 1);
      return;
    }
    if (!validateStep(step)) return;
    if (submit.kind === "submitting") return;

    setSubmit({ kind: "submitting" });
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ application: draft, website: honeypot, startedAt: startedAt.current, turnstileToken }),
      });
      const data = (await res.json().catch(() => ({}))) as { applicationNumber?: string; message?: string; fieldErrors?: FieldErrors };

      if (res.ok && data.applicationNumber) {
        completed.current = true;
        track("application_completed");
        try {
          sessionStorage.removeItem(DRAFT_KEY);
        } catch {}
        router.push(`/success?id=${encodeURIComponent(data.applicationNumber)}`);
        return;
      }

      if (res.status === 422 && data.fieldErrors) {
        const errs = data.fieldErrors;
        setErrors(errs);
        const firstStep = Math.min(...Object.keys(errs).map((k) => FIELD_STEP[k as keyof ApplicationInput] ?? 4));
        if (firstStep !== step) goTo(firstStep);
        focusFirstError(errs);
      }
      setSubmit({ kind: "error", message: data.message ?? "We couldn't submit your application. Please try again." });
    } catch {
      setSubmit({
        kind: "error",
        message: "We couldn't reach our servers. Please check your connection and try again — your answers are saved.",
      });
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const last = step === STEPS.length - 1;
  const goal = typeof draft.businessGoal === "string" ? draft.businessGoal : "";

  return (
    <form onSubmit={onSubmit} noValidate aria-describedby="form-status" className="relative">
      <div ref={formTopRef} className="scroll-mt-[calc(var(--nav-h)+2rem)]" />

      {/* Progress */}
      <div className="mb-12 flex gap-1.5" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.title} className="h-0.5 flex-1 overflow-hidden bg-ink/10">
            <m.span
              className="block h-full bg-ink"
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              style={{ originX: 0 }}
              transition={{ duration: 0.6 }}
            />
          </span>
        ))}
      </div>

      {/* Honeypot: hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div id="form-status" role="status" aria-live="polite" className="sr-only">
        {errorCount > 0 ? `${errorCount} ${errorCount === 1 ? "field needs" : "fields need"} attention.` : ""}
      </div>

      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <m.div
          key={step}
          custom={direction}
          variants={{
            enter: (d: number) => ({ opacity: 0, x: d * 32 }),
            center: { opacity: 1, x: 0 },
            exit: (d: number) => ({ opacity: 0, x: d * -32 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <ApplicationStep
            focusOnMount={navigated}
            index={step}
            total={STEPS.length}
            title={STEPS[step].title}
            description={STEPS[step].description}
          >
            {step === 0 ? (
              <>
                <ApplicationField id="fullName" label="Full name" required error={errors.fullName}>
                  {(a) => (
                    <input
                      {...a}
                      className={inputClass}
                      type="text"
                      autoComplete="name"
                      value={draft.fullName ?? ""}
                      onChange={(e) => set("fullName", e.target.value)}
                    />
                  )}
                </ApplicationField>
                <div className="grid gap-9 sm:grid-cols-2">
                  <ApplicationField
                    id="mobile"
                    label="Mobile number"
                    required
                    error={errors.mobile}
                    hint="Indian mobile numbers can be entered without +91."
                  >
                    {(a) => (
                      <input
                        {...a}
                        className={inputClass}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={draft.mobile ?? ""}
                        onChange={(e) => set("mobile", e.target.value)}
                      />
                    )}
                  </ApplicationField>
                  <ApplicationField id="email" label="Email" required error={errors.email}>
                    {(a) => (
                      <input
                        {...a}
                        className={inputClass}
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={draft.email ?? ""}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    )}
                  </ApplicationField>
                </div>
                <div className="grid gap-9 sm:grid-cols-2">
                  <ApplicationField id="city" label="City" required error={errors.city}>
                    {(a) => (
                      <input
                        {...a}
                        className={inputClass}
                        type="text"
                        autoComplete="address-level2"
                        value={draft.city ?? ""}
                        onChange={(e) => set("city", e.target.value)}
                      />
                    )}
                  </ApplicationField>
                  <ApplicationField id="state" label="State" required error={errors.state}>
                    {(a) => (
                      <div className="relative">
                        <select
                          {...a}
                          className={cn(inputClass, "appearance-none pr-8", !draft.state && "text-muted")}
                          autoComplete="address-level1"
                          value={draft.state ?? ""}
                          onChange={(e) => set("state", e.target.value)}
                        >
                          <option value="" disabled>
                            Select your state
                          </option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 8"
                          className="pointer-events-none absolute right-1 top-1/2 w-3 -translate-y-1/2"
                        >
                          <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.3" />
                        </svg>
                      </div>
                    )}
                  </ApplicationField>
                </div>
              </>
            ) : null}

            {step === 1 ? (
              <>
                <ChoiceGroup
                  name="applicantType"
                  legend="Which best describes you?"
                  options={APPLICANT_TYPES}
                  value={draft.applicantType as string | undefined}
                  onChange={(v) => set("applicantType", v as ApplicationInput["applicantType"])}
                  error={errors.applicantType}
                />
                <ChoiceGroup
                  name="businessStatus"
                  legend="Do you currently run a business?"
                  options={BUSINESS_STATUS}
                  columns={3}
                  value={draft.businessStatus as string | undefined}
                  onChange={(v) => set("businessStatus", v as ApplicationInput["businessStatus"])}
                  error={errors.businessStatus}
                />
                <ChoiceGroup
                  name="salesExperience"
                  legend="Sales / business experience"
                  options={SALES_EXPERIENCE}
                  value={draft.salesExperience as string | undefined}
                  onChange={(v) => set("salesExperience", v as ApplicationInput["salesExperience"])}
                  error={errors.salesExperience}
                />
              </>
            ) : null}

            {step === 2 ? (
              <>
                <ChoiceGroup
                  multiple
                  name="targetCustomers"
                  legend="Who do you plan to sell software to?"
                  hint="Choose all that apply."
                  options={TARGET_CUSTOMERS}
                  columns={3}
                  value={(draft.targetCustomers as string[]) ?? []}
                  onChange={(v) => set("targetCustomers", v as ApplicationInput["targetCustomers"])}
                  error={errors.targetCustomers}
                />
                <ApplicationField
                  id="targetLocation"
                  label="Target location"
                  required
                  error={errors.targetLocation}
                  hint="City, district or state you want to focus on."
                >
                  {(a) => (
                    <input
                      {...a}
                      className={inputClass}
                      type="text"
                      value={draft.targetLocation ?? ""}
                      onChange={(e) => set("targetLocation", e.target.value)}
                    />
                  )}
                </ApplicationField>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <ChoiceGroup
                  multiple
                  name="acquisitionMethods"
                  legend="How will you acquire customers?"
                  hint="Choose all that apply."
                  options={ACQUISITION_METHODS}
                  value={(draft.acquisitionMethods as string[]) ?? []}
                  onChange={(v) => set("acquisitionMethods", v as ApplicationInput["acquisitionMethods"])}
                  error={errors.acquisitionMethods}
                />
                <ChoiceGroup
                  name="startTimeline"
                  legend="When would you like to start?"
                  options={START_TIMELINES}
                  value={draft.startTimeline as string | undefined}
                  onChange={(v) => set("startTimeline", v as ApplicationInput["startTimeline"])}
                  error={errors.startTimeline}
                />
              </>
            ) : null}

            {step === 4 ? (
              <>
                <ApplicationField
                  id="businessGoal"
                  label="Why do you want to become an LMI Technology Partner?"
                  required
                  error={errors.businessGoal}
                >
                  {(a) => (
                    <>
                      <textarea
                        {...a}
                        rows={7}
                        maxLength={GOAL_MAX}
                        className="mt-3 block w-full resize-y border border-ink/25 bg-white/40 p-4 text-lg leading-relaxed text-ink placeholder:text-muted/70 transition-colors duration-300 focus:border-ink focus:outline-none aria-[invalid=true]:border-danger"
                        placeholder="Tell us about your market, your experience and what you want to build."
                        value={goal}
                        onChange={(e) => set("businessGoal", e.target.value)}
                      />
                      <p className="mt-2 text-right text-xs tabular-nums text-muted" aria-hidden="true">
                        {goal.length.toLocaleString("en-IN")} / {GOAL_MAX.toLocaleString("en-IN")}
                      </p>
                    </>
                  )}
                </ApplicationField>

                <div>
                  <label htmlFor="consent" className="flex cursor-pointer items-start gap-4">
                    <input
                      id="consent"
                      type="checkbox"
                      checked={draft.consent === true}
                      onChange={(e) => set("consent", e.target.checked as true)}
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? "consent-error" : undefined}
                      className="mt-0.5 size-5 shrink-0 cursor-pointer accent-ink"
                    />
                    <span className="leading-relaxed">
                      I agree that LMI may contact me regarding my application.
                      <span aria-hidden="true"> *</span>
                    </span>
                  </label>
                  {errors.consent ? (
                    <p id="consent-error" className="mt-2 pl-9 text-sm text-danger">
                      {errors.consent}
                    </p>
                  ) : null}
                </div>

                {turnstileEnabled ? <Turnstile onToken={setTurnstileToken} /> : null}
              </>
            ) : null}
          </ApplicationStep>
        </m.div>
      </AnimatePresence>

      {submit.kind === "error" ? (
        <div role="alert" className="mt-10 border border-danger/40 bg-white/50 p-5 text-sm leading-relaxed">
          <p className="font-medium text-danger">Your application wasn&rsquo;t submitted.</p>
          <p className="mt-1 text-ink">{submit.message}</p>
        </div>
      ) : null}

      <div className="mt-12 flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="outline" onClick={() => goTo(step - 1)} className="w-full sm:w-auto">
            Back
          </Button>
        ) : (
          <span className="hidden text-sm text-muted sm:block">Takes about 2–3 minutes.</span>
        )}
        <Button
          type="submit"
          size="lg"
          arrow
          disabled={submit.kind === "submitting"}
          className="w-full sm:w-auto"
          aria-busy={submit.kind === "submitting"}
        >
          {last ? (submit.kind === "submitting" ? "Submitting…" : "Submit Application") : "Continue"}
        </Button>
      </div>
    </form>
  );
}
