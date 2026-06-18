import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import { loadPlaces, getPlacesByNiche, isIndexable } from "@/lib/data";
import type { Niche } from "@/lib/types";

// Next.js auto-builds the sitemap index (/sitemap.xml) from generateSitemaps()
// and emits one /sitemap/{id}.xml per entry. We split BY TYPE so each file is a
// clean, separately-crawlable unit and stays well under Google's 50K limit:
//   id 0  → static pages + niche category pages + wiki
//   id 1  → niche × city programmatic-SEO pages
//   id 2+ → place detail pages, one file per language (indexable only)
//
// Only routes that actually render are emitted. Old WordPress URLs (/blog-1/,
// /2834-2/, /wp-login.php, …) are never listed because we only build from the
// known route table — and they now 404 anyway (see app/[lang] lang guard).

// All 34 niches now have a standalone category page (/c/[niche]/) and are
// eligible for niche × city pages. The sitemap still skips any category with
// <5 indexable places (matches the page's noindex rule).
const ALL_NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
  "halal-arab", "halal-bakery", "halal-bbq", "halal-buffet", "halal-burger",
  "halal-cafe", "halal-cooking-class", "halal-grocery", "halal-indian",
  "halal-japanese", "halal-korean", "halal-mediterranean", "halal-pizza",
  "halal-seafood", "halal-shisha-cafe", "halal-street-food", "halal-thai",
  "halal-laundry", "halal-pharmacy", "iftar-buffet", "modest-fashion",
  "muslim-attractions", "muslim-driver", "muslim-friendly-spa", "muslim-wedding",
  "prayer-room", "southern-muslim", "arabic-school",
];

const CITY_SLUGS = [
  "bangkok", "phuket", "krabi", "chiang-mai", "hat-yai", "pattaya",
  "hua-hin", "koh-samui", "ko-lanta", "pattani",
];

const STATIC_PATHS = [
  "", "/about/", "/why-us/", "/search/", "/how-we-verify/", "/ramadan-2027/",
  "/wiki/",
];

const WIKI_TOPIC_SLUGS = [
  "cicot-certification", "ramadan-in-thailand", "iftar-buffets-bangkok",
  "prayer-rooms-thai-airports", "muslim-travel-etiquette", "halal-vs-muslim-friendly",
  "halal-tourism-statistics", "qibla-direction-thailand", "jumah-prayer-bangkok-mosques",
  "halal-meat-suppliers-thailand", "muslim-population-thailand", "alcohol-free-thai-drinks",
  "wudu-facilities-bangkok", "family-friendly-halal-hotels-phuket",
  "southern-thailand-muslim-history", "zamzam-water-availability-bangkok",
  "arabic-language-thailand", "halal-medical-tourism",
  "muslim-wedding-customs-thailand", "turkish-restaurant-history-bangkok",
];

const WIKI_NICHE_SLUGS: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

export const dynamic = "force-static";

export async function generateSitemaps() {
  // 0: static + category + wiki | 1: niche×city | 2..N: place pages per language
  return [{ id: 0 }, { id: 1 }, ...SUPPORTED_LANGS.map((_, i) => ({ id: i + 2 }))];
}

function langAlternates(buildPath: (l: string) => string) {
  return {
    languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, buildPath(l)])),
  };
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const bundle = loadPlaces();
  // Real content timestamp from the data build, not the deploy time — gives
  // crawlers a meaningful lastmod for everything derived from place data.
  const dataMod = bundle.generated_at ? new Date(bundle.generated_at) : new Date();
  const now = new Date();

  // ── id 0: static pages + niche category (6) + wiki ───────────────────────
  if (id === 0) {
    const urls: MetadataRoute.Sitemap = [
      { url: `${SITE.origin}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
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
      // Niche category pages — all 34 render now, but only list those with ≥5
      // indexable places (matches the category page's noindex rule, so we never
      // advertise a noindex'd page).
      for (const niche of ALL_NICHES) {
        if (getPlacesByNiche(niche).filter(isIndexable).length < 5) continue;
        urls.push({
          url: `${SITE.origin}/${lang}/c/${niche}/`,
          lastModified: dataMod,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/c/${niche}/`),
        });
      }
      for (const slug of WIKI_TOPIC_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/topic/${slug}/`,
          lastModified: dataMod,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/topic/${slug}/`),
        });
      }
      for (const slug of CITY_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/city/${slug}/`,
          lastModified: dataMod,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/city/${slug}/`),
        });
      }
      for (const niche of WIKI_NICHE_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/niche/${niche}/`,
          lastModified: dataMod,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/niche/${niche}/`),
        });
      }
    }
    return urls;
  }

  // ── id 1: niche × city programmatic pages (only published if ≥3 places) ───
  if (id === 1) {
    const urls: MetadataRoute.Sitemap = [];
    for (const niche of ALL_NICHES) {
      const nichePlaces = getPlacesByNiche(niche);
      for (const slug of CITY_SLUGS) {
        const count = nichePlaces.filter((p) =>
          p.city && p.city.toLowerCase().includes(slug.replace(/-/g, " "))
        ).length;
        if (count < 3) continue;
        for (const lang of SUPPORTED_LANGS) {
          urls.push({
            url: `${SITE.origin}/${lang}/c/${niche}/${slug}/`,
            lastModified: dataMod,
            changeFrequency: "weekly",
            priority: 0.75,
            alternates: langAlternates((l) => `${SITE.origin}/${l}/c/${niche}/${slug}/`),
          });
        }
      }
    }
    return urls;
  }

  // ── id 2..N: place detail pages, one file per language (indexable only) ───
  const langIndex = id - 2;
  const lang = SUPPORTED_LANGS[langIndex];
  if (!lang) return [];

  const indexable = bundle.places.filter(isIndexable);
  return indexable.map((p) => ({
    url: `${SITE.origin}/${lang}/place/${p.slug}/`,
    lastModified: dataMod,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    alternates: langAlternates((l) => `${SITE.origin}/${l}/place/${p.slug}/`),
  }));
}
