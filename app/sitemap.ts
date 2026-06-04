import type { MetadataRoute } from "next";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import { loadPlaces, getPlacesByNiche } from "@/lib/data";
import type { Niche } from "@/lib/types";

// Next.js auto-builds the sitemap index (/sitemap.xml) from generateSitemaps()
// and emits one /sitemap/{id}.xml per entry. Splitting keeps each sub-sitemap
// under Google's 50K URL limit and serves them as fully static files.

const NICHES: Niche[] = [
  // original 6
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
  // 28 expanded (v6-v11)
  "halal-arab", "halal-bakery", "halal-bbq", "halal-buffet", "halal-burger",
  "halal-cafe", "halal-cooking-class", "halal-grocery", "halal-indian",
  "halal-japanese", "halal-korean", "halal-mediterranean", "halal-pizza",
  "halal-seafood", "halal-shisha-cafe", "halal-street-food", "halal-thai",
  "halal-laundry", "halal-pharmacy", "iftar-buffet", "modest-fashion",
  "muslim-attractions", "muslim-driver", "muslim-friendly-spa", "muslim-wedding",
  "prayer-room", "southern-muslim", "arabic-school",
];

// All city slugs that have ≥3 places per niche — generates niche×city URLs.
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
      // Static pages (home, about, why-us, search, how-we-verify, ramadan-2027, wiki)
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
      // Niche category pages (34 niches)
      for (const niche of NICHES) {
        urls.push({
          url: `${SITE.origin}/${lang}/c/${niche}/`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/c/${niche}/`),
        });
      }
      // Wiki topic pages (20 topics)
      for (const slug of WIKI_TOPIC_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/topic/${slug}/`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/topic/${slug}/`),
        });
      }
      // Wiki city pages (10 cities)
      for (const slug of CITY_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/city/${slug}/`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.7,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/city/${slug}/`),
        });
      }
      // Wiki niche pages (only the original 6 have curated content)
      const WIKI_NICHE_SLUGS: Niche[] = [
        "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
      ];
      for (const niche of WIKI_NICHE_SLUGS) {
        urls.push({
          url: `${SITE.origin}/${lang}/wiki/niche/${niche}/`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.65,
          alternates: langAlternates((l) => `${SITE.origin}/${l}/wiki/niche/${niche}/`),
        });
      }
    }

    // Niche × city pages (only published if ≥3 places — emit best-effort,
    // 404s on unpublished combos are fine for sitemap purposes)
    for (const niche of NICHES) {
      const nichePlaces = getPlacesByNiche(niche);
      for (const slug of CITY_SLUGS) {
        // Quick check: at least 3 places in this niche × city
        const count = nichePlaces.filter((p) =>
          p.city && p.city.toLowerCase().includes(slug.replace(/-/g, " "))
        ).length;
        if (count < 3) continue;
        for (const lang of SUPPORTED_LANGS) {
          urls.push({
            url: `${SITE.origin}/${lang}/c/${niche}/${slug}/`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.75,
            alternates: langAlternates((l) => `${SITE.origin}/${l}/c/${niche}/${slug}/`),
          });
        }
      }
    }

    return urls;
  }

  // Chunks 1..N — one per language, contains only place pages for that lang
  const langIndex = id - 1;
  const lang = SUPPORTED_LANGS[langIndex];
  if (!lang) return [];

  const bundle = loadPlaces();
  // Filter low-confidence pages out of sitemap (matches place page noindex
  // logic — Google shouldn't be asked to crawl pages we don't want indexed).
  const indexable = bundle.places.filter((p) => {
    const halalCount = p.halal_signal_count || 0;
    const lowConf = p.trust_score < 30 || (halalCount === 0 && !p.is_halal_signaled);
    return !lowConf;
  });
  return indexable.map((p) => ({
    url: `${SITE.origin}/${lang}/place/${p.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
    alternates: langAlternates((l) => `${SITE.origin}/${l}/place/${p.slug}/`),
  }));
}
