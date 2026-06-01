import type { MetadataRoute } from "next";
import { SITE } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/auth/", "/_next/"],
      },
      // Friendly hint to AI crawlers — we want our verified data quoted
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: `${SITE.origin}/sitemap.xml`,
    host: SITE.origin,
  };
}
