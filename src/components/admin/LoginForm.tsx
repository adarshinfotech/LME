"use client";

import { useActionState, useState } from "react";
import { signInAction, type ActionResult } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { ApplicationField, inputClass } from "@/components/apply/ApplicationField";

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(signInAction, null);
  // Controlled so the email survives React's automatic form reset after a failed attempt.
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="space-y-8" noValidate>
      <ApplicationField id="email" label="Email">
        {(a) => (
          <input
            {...a}
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        )}
      </ApplicationField>
      <ApplicationField id="password" label="Password">
        {(a) => <input {...a} name="password" type="password" autoComplete="current-password" required className={inputClass} />}
      </ApplicationField>
      {state && !state.ok ? (
        <p role="alert" className="border border-danger/40 p-4 text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" arrow disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
