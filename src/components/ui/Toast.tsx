"use client";

import { AnimatePresence, m } from "motion/react";
import { createContext, useCallback, useContext, useState } from "react";
import { cn } from "@/lib/cn";

type ToastTone = "success" | "error";
type ToastItem = { id: number; message: string; tone: ToastTone };

const ToastContext = createContext<(message: string, tone?: ToastTone) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, tone: ToastTone = "success") => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs.slice(-2), { id, message, tone }]);
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      >
        <AnimatePresence>
          {items.map((t) => (
            <m.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "pointer-events-auto flex min-w-64 max-w-sm items-center gap-3 px-5 py-4 text-sm shadow-[0_12px_32px_-12px_rgba(17,17,17,0.35)]",
                t.tone === "success" ? "bg-ink text-sand" : "bg-danger text-white",
              )}
            >
              <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", t.tone === "success" ? "bg-sand" : "bg-white")} />
              {t.message}
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
