// City wiki article — Wikipedia-style guide to muslim travel in a Thai city.
//
// Sections:
//   ١  Overview          (intro from CITY_CONTENT)
//   ٢  Demographics       (muslim population context)
//   ٣  Key areas          (neighborhoods, with descriptions)
//   ٤  Notable mosques    (places filter: niche=mosque, city=)
//   ٥  Where to eat       (places filter: niche=halal-food, city=, top 8)
//   ٦  Where to stay      (places filter: niche=muslim-hotel, city=, top 5)
//   ٧  Travel tips        (city-specific practical tips)
//   ⏰ Prayer times       (AlAdhan widget for the city)
//   §  References         (community threads filtered to this city)
//   §  See also           (other cities + relevant niches)

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces } from "@/lib/data";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang, Niche, Place } from "@/lib/types";
import { CITIES } from "@/lib/wiki-registry";
import { getCityContent } from "@/lib/city-content";

import WikiLayout from "@/components/wiki/WikiLayout";
import WikiHeader from "@/components/wiki/WikiHeader";
import WikiSection from "@/components/wiki/WikiSection";
import Infobox from "@/components/wiki/Infobox";
import References, { type Reference } from "@/components/wiki/References";
import SeeAlso, { type SeeAlsoItem } from "@/components/wiki/SeeAlso";
import PrayerTimes from "@/components/PrayerTimes";

export const revalidate = 43200;  // refresh prayer-times widget every 12h

export function generateStaticParams() {
  const params: Array<{ lang: Lang; city: string }> = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const c of CITIES) params.push({ lang, city: c.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: { lang: Lang; city: string } }): Promise<Metadata> {
  const { lang, city } = params;
  const entry = CITIES.find((c) => c.slug === city);
  const content = getCityContent(city);
  if (!entry || !content) return {};
  const title = `Muslim travel in ${entry.name} — Wiki guide · ${SITE.name}`;
  const description = content.intro.slice(0, 200);
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.origin}/${lang}/wiki/city/${city}/`,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/wiki/city/${city}/`])),
        "x-default": `${SITE.origin}/en/wiki/city/${city}/`,
      },
    },
  };
}

function matchCity(p: Place, names: string[]): boolean {
  const c = (p.city || "").toLowerCase().trim();
  if (!c) return false;
  return names.some((n) => n.toLowerCase() === c);
}

export default function CityWikiPage({ params }: { params: { lang: Lang; city: string } }) {
  const { lang, city } = params;
  const entry = CITIES.find((c) => c.slug === city);
  const content = getCityContent(city);
  if (!entry || !content) notFound();

  const allPlaces = loadPlaces().places;
  const cityPlaces = allPlaces.filter((p) => matchCity(p, entry.matchCities));

  // == Top picks by niche ==========================================
  const top = (niche: Niche, limit: number) =>
    cityPlaces
      .filter((p) => p.niche === niche && !p.is_suspected_viral)
      .sort((a, b) => b.trust_score - a.trust_score)
      .slice(0, limit);

  const topMosques = top("mosque", 5);
  const topFood    = top("halal-food", 8);
  const topHotels  = top("muslim-hotel", 5);

  // == Stats =======================================================
  const totalVerified = cityPlaces.length;
  const avgTrust = totalVerified > 0
    ? Math.round(cityPlaces.reduce((s, p) => s + p.trust_score, 0) / totalVerified)
    : 0;
  const halalSignaled = cityPlaces.filter((p) => p.is_halal_signaled).length;

  // == References ==================================================
  const refs: Reference[] = [];
  let n = 1;
  for (const p of cityPlaces.slice(0, 30)) {
    if (!p.community_mentions) continue;
    for (const m of p.community_mentions) {
      if (refs.length >= 6) break;
      const source = m.kind === "reddit" ? `Reddit · r/${m.subreddit || "all"}` : m.kind === "pantip" ? "Pantip" : "Naver Blog";
      refs.push({ n: n++, title: m.title || p.name, source, url: m.url, date: m.date });
    }
    if (refs.length >= 6) break;
  }
  refs.push({ n: n++, title: "Central Islamic Council of Thailand · halal.or.th", source: "Official certification authority", url: "https://www.halal.or.th/" });
  refs.push({ n: n++, title: "Tourism Authority of Thailand · tourismthailand.org", source: "Government tourism data", url: "https://www.tourismthailand.org/" });

  // == See also ====================================================
  const seeAlso: SeeAlsoItem[] = CITIES
    .filter((c) => c.slug !== city)
    .slice(0, 5)
    .map((c) => ({
      href: `/${lang}/wiki/city/${c.slug}/`,
      label: `${c.emoji} Muslim travel in ${c.name}`,
      hint: c.hint,
    }));
  seeAlso.push({ href: `/${lang}/wiki/topic/cicot-certification/`, label: "✅ CICOT halal certification", hint: "How Thailand's halal label works" });
  seeAlso.push({ href: `/${lang}/wiki/topic/muslim-travel-etiquette/`, label: "🤝 Muslim travel etiquette in Thailand", hint: "What to expect, what to ask" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    headline: `Muslim travel in ${entry.name} — Wiki guide`,
    description: content.intro.slice(0, 250),
    datePublished: "2026-05-31",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    mainEntityOfPage: `${SITE.origin}/${lang}/wiki/city/${city}/`,
    about: { "@type": "City", name: entry.name, containedInPlace: { "@type": "Country", name: "Thailand" } },
    inLanguage: lang,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <WikiLayout
        aside={
          <Infobox
            title={entry.name}
            subtitle="Muslim travel guide"
            emoji={entry.emoji}
            rows={[
              { label: "Verified", value: <strong>{totalVerified.toLocaleString()}</strong> },
              { label: "Avg Trust", value: <strong>{avgTrust}/100</strong> },
              { label: "Halal signals", value: `${halalSignaled} (${totalVerified > 0 ? Math.round(100 * halalSignaled / totalVerified) : 0}%)` },
              { label: "Mosques", value: `${topMosques.length}+ verified` },
              { label: "Population", value: entry.matchCities.join(" · ") },
            ]}
            cta={{ label: `Browse all in ${entry.name}`, href: `/${lang}/search/?city=${encodeURIComponent(entry.name)}` }}
            footnote={`Updated ${new Date().toISOString().slice(0, 10)} · 8 sources cross-checked`}
          />
        }
      >
        <WikiHeader
          lang={lang}
          kind="city"
          title={`Muslim travel in ${entry.name}`}
          subtitle={entry.hint}
          lastModified={new Date().toISOString().slice(0, 10)}
          readMinutes={7}
        />

        {/* §1 Overview */}
        <WikiSection n={1} title="Overview">
          <p className="drop-cap">{content.intro}</p>
        </WikiSection>

        {/* §2 Demographics */}
        <WikiSection n={2} title="Muslim community context">
          <p>{content.muslimPopulationHint}</p>
        </WikiSection>

        {/* §3 Key areas */}
        {content.keyAreas.length > 0 && (
          <WikiSection n={3} title="Key areas & neighborhoods">
            <ul>
              {content.keyAreas.map((a) => (
                <li key={a.name}>
                  <strong>{a.name}</strong> — {a.description}
                </li>
              ))}
            </ul>
          </WikiSection>
        )}

        {/* §4 Mosques */}
        {(topMosques.length > 0 || content.notableMosques.length > 0) && (
          <WikiSection n={4} title="Notable mosques">
            {content.notableMosques.length > 0 && (
              <p>
                Historic and currently-active mosques in {entry.name}: {content.notableMosques.join(", ")}.
              </p>
            )}
            {topMosques.length > 0 && (
              <>
                <p>Verified mosques in our directory (sorted by Trust Score):</p>
                <ol className="not-prose mt-3 space-y-2">
                  {topMosques.map((p, i) => (
                    <li key={p.id}>
                      <Link href={`/${lang}/place/${p.slug}/`} className="card-editorial flex items-center gap-3 p-3 transition hover:border-gold-400">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-700 font-bold text-white">{i + 1}</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">{p.name}</div>
                          <div className="text-[11px] muted">Trust {p.trust_score} · {p.rating ? `★ ${p.rating.toFixed(1)}` : "—"}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </WikiSection>
        )}

        {/* §5 Where to eat */}
        {topFood.length > 0 && (
          <WikiSection n={5} title="Where to eat halal">
            <p>Top {topFood.length} halal restaurants in {entry.name} by Trust Score:</p>
            <ol className="not-prose mt-3 space-y-2">
              {topFood.map((p, i) => (
                <li key={p.id}>
                  <Link href={`/${lang}/place/${p.slug}/`} className="card-editorial flex items-center gap-3 p-3 transition hover:border-gold-400">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-600 font-bold text-white">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">{p.name}</div>
                      <div className="text-[11px] muted">Trust {p.trust_score} · {p.rating ? `★ ${p.rating.toFixed(1)}` : "—"}{p.review_count ? ` (${p.review_count})` : ""}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </WikiSection>
        )}

        {/* §6 Where to stay */}
        {topHotels.length > 0 && (
          <WikiSection n={6} title="Where to stay">
            <p>Muslim-friendly hotels in {entry.name} (verified across our 8 sources):</p>
            <ol className="not-prose mt-3 space-y-2">
              {topHotels.map((p, i) => (
                <li key={p.id}>
                  <Link href={`/${lang}/place/${p.slug}/`} className="card-editorial flex items-center gap-3 p-3 transition hover:border-gold-400">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-700 font-bold text-white">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">{p.name}</div>
                      <div className="text-[11px] muted">Trust {p.trust_score} · {p.rating ? `★ ${p.rating.toFixed(1)}` : "—"}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </WikiSection>
        )}

        {/* §7 Travel tips */}
        {content.travelTips.length > 0 && (
          <WikiSection n={7} title="Practical travel tips">
            <ul>
              {content.travelTips.map((tip) => (
                <li key={tip.title}>
                  <strong>{tip.title}</strong> — {tip.body}
                </li>
              ))}
            </ul>
          </WikiSection>
        )}

        {/* Prayer times widget */}
        <section className="mt-10">
          <h2 className="mb-4 flex items-baseline gap-3 font-display text-2xl font-bold text-islam-950 dark:text-islam-50">
            <span className="text-base font-bold text-gold-700 dark:text-gold-400">⏰</span>
            Today's prayer times
          </h2>
          <PrayerTimes city={entry.name} />
        </section>

        <References refs={refs} />
        <SeeAlso items={seeAlso} />
      </WikiLayout>
    </>
  );
}
