"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    track("page_view");
    if (pathname === "/apply") track("apply_page_view");
  }, [pathname]);
  return null;
}
