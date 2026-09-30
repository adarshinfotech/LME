import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/solutions", "/partner", "/how-it-works", "/apply", "/privacy", "/terms"];
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    changeFrequency: "monthly",
    priority: r === "" ? 1 : r === "/apply" ? 0.9 : 0.7,
  }));
}
