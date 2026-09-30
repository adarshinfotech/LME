import type { Metadata } from "next";
import { ToastProvider } from "@/components/ui/Toast";

// Auth state is per-request; never prerender any admin route.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — LMI Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
