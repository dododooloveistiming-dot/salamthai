import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import { loadPlaces } from "@/lib/data";
import type { Niche } from "@/lib/types";

// Next.js auto-builds the sitemap index (/sitemap.xml) from generateSitemaps()
// and emits one /sitemap/{id}.xml per entry. Splitting by language keeps each
// sub-sitemap small (~5k URLs) and serves them as fully static files instead
// of running the generator on every request (previous behaviour was 5 MB and
// ~35s response time because hybrid mode evaluated this on demand).

const NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];
const STATIC_PATHS = ["", "/about/", "/why-us/", "/search/"];

export const dynamic = "force-static";

export async function generateSitemaps() {
  // 0: static pages + niche category pages (all languages, with hreflang)
  // 1..N: per-language place pages
  return [{ id: 0 }, ...SUPPORTED_LANGS.map((_, i) => ({ id: i + 1 }))];
}

function langAlternates(buildPath: (l: string) => string) {
  return {
    languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, buildPath(l)])),
  };
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Chunk 0 — static & category pages
  if (id === 0) {
    const urls: MetadataRoute.Sitemap = [
      {
        url: `${SITE.origin}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1,
      },
    ];
    for (const lang of SUPPORTED_LANGS) {
      for (const p of STATIC_PATHS) {
        const path = p === "" ? "/" : p;
        urls.push({
          url: `${SITE.origin}/${lang}${path}`,
          lastModified: now,
          changeFrequency: p === "" ? "weekly" : "monthly",
          priority: p === "" ? 0.9 : 0.6,
          alternates: langAlternates((l) => `${SITE.origin}/${l}${path}`),
        });
      }
      for (const niche of NICHES) {
        urls.push({
          url: `${SITE.origin}/${lang}/c/${niche}/`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/c/${niche}/`),
        });
      }
    }
    return urls;
  }

  // Chunks 1..N — one per language, contains only place pages for that lang
  const langIndex = id - 1;
  const lang = SUPPORTED_LANGS[langIndex];
  if (!lang) return [];

  const bundle = loadPlaces();
  return bundle.places.map((p) => ({
    url: `${SITE.origin}/${lang}/place/${p.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    alternates: langAlternates((l) => `${SITE.origin}/${l}/place/${p.slug}/`),
  }));
}
