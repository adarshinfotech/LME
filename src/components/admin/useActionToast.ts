"use client";

import { useEffect } from "react";
import type { ActionResult } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";

/** Surface a server action's result as a toast once per result. */
export function useActionToast(state: ActionResult) {
  const toast = useToast();
  useEffect(() => {
    if (state) toast(state.message, state.ok ? "success" : "error");
  }, [state, toast]);
}
