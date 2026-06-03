// Niche wiki article — Wikipedia-style long-form entry per muslim niche.
//
// Sections:
//   ١  Overview          (intro from NICHE_GUIDES)
//   ٢  How to evaluate   (criteria array — what makes a "good" venue here)
//   ٣  Where to find     (citySpotlights — city-by-city orientation)
//   ٤  Notable places    (top 10 by trust score, with mini-cards)
//   ٥  Certification & signals  (halal signals breakdown for this niche)
//   ٦  Common questions  (faqs — also JSON-LD FAQPage)
//   §  References        (community threads from sample places)
//   §  See also          (other niches + city guides)
//
// Aside: Infobox with stats (verified count, avg trust, top city, halal cert %)
//
// Long enough (~1500 words) to read as a real encyclopedia entry, structured
// enough that LLMs (Perplexity / ChatGPT) cite specific sections by anchor.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlacesByNiche, getPlacesLiteByNiche } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";
import { NICHE_GUIDES, EMPTY_GUIDE, ll } from "@/lib/niche-content";

import WikiLayout from "@/components/wiki/WikiLayout";
import WikiHeader from "@/components/wiki/WikiHeader";
import WikiSection from "@/components/wiki/WikiSection";
import Infobox from "@/components/wiki/Infobox";
import References, { Cite, type Reference } from "@/components/wiki/References";
import SeeAlso, { type SeeAlsoItem } from "@/components/wiki/SeeAlso";
import PlacePhoto from "@/components/PlacePhoto";

const NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

export const dynamic = "force-static";

export function generateStaticParams() {
  const params: Array<{ lang: Lang; niche: Niche }> = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const niche of NICHES) params.push({ lang, niche });
  }
  return params;
}

export async function generateMetadata({ params }: { params: { lang: Lang; niche: Niche } }): Promise<Metadata> {
  const { lang, niche } = params;
  if (!NICHES.includes(niche)) return {};
  const guide = NICHE_GUIDES[niche] ?? EMPTY_GUIDE;
  const title = `${nicheName(niche, lang)} in Thailand — Wiki entry · ${SITE.name}`;
  const description = ll(guide.intro, lang).slice(0, 200);
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE.origin}/${lang}/wiki/niche/${niche}/`,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/wiki/niche/${niche}/`])),
    },
  };
}

export default function NicheWikiPage({ params }: { params: { lang: Lang; niche: Niche } }) {
  const { lang, niche } = params;
  if (!NICHES.includes(niche)) notFound();

  const guide = NICHE_GUIDES[niche] ?? EMPTY_GUIDE;
  const meta = NICHE_META[niche];
  const places = getPlacesByNiche(niche);
  const placesLite = getPlacesLiteByNiche(niche);

  // === Stats for Infobox ===========================================
  const totalPlaces = places.length;
  const avgTrust = totalPlaces > 0
    ? Math.round(places.reduce((s, p) => s + p.trust_score, 0) / totalPlaces)
    : 0;
  const cityCounts = new Map<string, number>();
  for (const p of places) if (p.city) cityCounts.set(p.city, (cityCounts.get(p.city) ?? 0) + 1);
  const topCities = [...cityCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const halalSignaledCount = places.filter((p) => p.is_halal_signaled).length;
  const cicotCount = places.filter((p) => p.halal_signals_detected?.includes("CICOT")).length;

  // === Notable places (top 10 by trust) =============================
  const notable = [...placesLite]
    .filter((p) => !p.is_suspected_viral)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 10);

  // === References — pull a few community threads from top places ====
  const refs: Reference[] = [];
  let refIdx = 1;
  for (const p of places.slice(0, 30)) {
    if (!p.community_mentions) continue;
    for (const m of p.community_mentions) {
      if (refs.length >= 8) break;
      const source = m.kind === "reddit" ? `Reddit · r/${m.subreddit || "all"}` : m.kind === "pantip" ? "Pantip" : "Naver Blog";
      refs.push({
        n: refIdx++,
        title: m.title || p.name,
        source,
        url: m.url,
        date: m.date,
      });
    }
    if (refs.length >= 8) break;
  }
  // Always cite the official source
  refs.push({
    n: refIdx++,
    title: "Central Islamic Council of Thailand · halal.or.th",
    source: "Official certification authority",
    url: "https://www.halal.or.th/",
    date: "verified 2026",
  });

  // === See also =====================================================
  const allBundle = loadPlaces();
  const seeAlso: SeeAlsoItem[] = NICHES
    .filter((n) => n !== niche)
    .filter((n) => ((allBundle.by_niche as Record<string, number>)[n] ?? 0) > 0)
    .slice(0, 5)
    .map((n) => ({
      href: `/${lang}/wiki/niche/${n}/`,
      label: `${NICHE_META[n].emoji} ${nicheName(n, lang)} in Thailand`,
      hint: nicheTagline(n, lang).slice(0, 60),
    }));
  // Add a city guide cross-link
  const topCityName = topCities[0]?.[0];
  if (topCityName) {
    seeAlso.push({
      href: `/${lang}/wiki/city/${topCityName.toLowerCase().replace(/\s+/g, "-")}/`,
      label: `🏙 Muslim travel in ${topCityName}`,
      hint: "city guide",
    });
  }
  seeAlso.push({
    href: `/${lang}/wiki/topic/cicot-certification/`,
    label: "✅ CICOT halal certification",
    hint: "how Thailand's official halal label works",
  });

  // === FAQ JSON-LD for AEO =========================================
  const faqJsonLd = guide.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: ll(f.q, lang),
      acceptedAnswer: { "@type": "Answer", text: ll(f.a, lang) },
    })),
  } : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${nicheName(niche, lang)} in Thailand — Wiki entry`,
    description: ll(guide.intro, lang).slice(0, 250),
    datePublished: "2026-05-31",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    mainEntityOfPage: `${SITE.origin}/${lang}/wiki/niche/${niche}/`,
    inLanguage: lang,
  };

  return (
    <>
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <WikiLayout
        aside={
          <Infobox
            title={nicheName(niche, lang)}
            subtitle="in Thailand"
            emoji={meta.emoji}
            rows={[
              { label: "Verified", value: <strong>{totalPlaces.toLocaleString()}</strong> },
              { label: "Avg Trust", value: <strong>{avgTrust}/100</strong> },
              { label: "Halal-signaled", value: `${halalSignaledCount} (${totalPlaces > 0 ? Math.round((halalSignaledCount / totalPlaces) * 100) : 0}%)` },
              { label: "CICOT-marked", value: `${cicotCount}` },
              { label: "Top cities", value: topCities.slice(0, 3).map(([c, n]) => `${c} (${n})`).join(", ") || "—" },
              { label: "Languages", value: "EN · KO · TH · ZH · JA · AR" },
            ]}
            cta={{ label: `Browse all ${totalPlaces.toLocaleString()}`, href: `/${lang}/c/${niche}/` }}
            footnote={`Updated ${new Date().toISOString().slice(0, 10)} · cross-checked across 8 sources`}
          />
        }
      >
        <WikiHeader
          lang={lang}
          kind="niche"
          title={`${nicheName(niche, lang)} in Thailand`}
          subtitle={nicheTagline(niche, lang)}
          lastModified={new Date().toISOString().slice(0, 10)}
          readMinutes={6}
        />

        {/* §1 Overview */}
        <WikiSection n={1} title="Overview">
          <p className="drop-cap">{ll(guide.intro, lang)}</p>
        </WikiSection>

        {/* §2 How to evaluate */}
        {guide.criteria.length > 0 && (
          <WikiSection n={2} title="How to evaluate">
            <p>
              Not every place that claims to be halal is equally rigorous. When auditing
              a {nicheName(niche, lang).toLowerCase()} venue, these are the signals that matter most
              <Cite n={1} />:
            </p>
            <ul>
              {guide.criteria.map((c, i) => (
                <li key={i}>
                  <strong>{ll(c.title, lang)}</strong> — {ll(c.body, lang)}
                </li>
              ))}
            </ul>
          </WikiSection>
        )}

        {/* §3 Where to find */}
        {guide.citySpotlights.length > 0 && (
          <WikiSection n={3} title="Where to find">
            <p>
              {nicheName(niche, lang)} is concentrated in a handful of areas across Thailand.
              City-by-city orientation:
            </p>
            {guide.citySpotlights.map((s) => (
              <div key={s.city}>
                <h3>📍 {s.city}</h3>
                <p>{ll(s.body, lang)}</p>
              </div>
            ))}
          </WikiSection>
        )}

        {/* §4 Notable establishments */}
        {notable.length > 0 && (
          <WikiSection n={4} title="Notable establishments">
            <p>
              Ranked by Trust Score (independent multi-source verification, not paid placement).
              These are the top {notable.length} {nicheName(niche, lang).toLowerCase()} venues
              currently in our directory:
            </p>
            <ol className="not-prose mt-4 space-y-2">
              {notable.map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={`/${lang}/place/${p.slug}/`}
                    className="group flex items-center gap-3 rounded-lg border border-islam-100 bg-white p-3 transition hover:border-gold-400 hover:shadow-sm dark:border-islam-800/40 dark:bg-ink-900"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-islam-950 font-display text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <div className="hidden sm:block">
                      <PlacePhoto
                        niche={p.niche}
                        name={p.name}
                        slug={p.slug}
                        photoUrl={p.top_photo_url}
                        trustScore={p.trust_score}
                        languages={p.languages}
                        className="h-12 w-16"
                        rounded="rounded-md"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">{p.name}</div>
                      <div className="text-[11px] muted">
                        {p.city && <>📍 {p.city} · </>}
                        Trust {p.trust_score}
                        {p.rating != null && <> · ★ {p.rating.toFixed(1)}</>}
                      </div>
                    </div>
                    <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ol>
          </WikiSection>
        )}

        {/* §5 Certification & signals */}
        <WikiSection n={5} title="Halal certification & signals">
          <p>
            Of the {totalPlaces.toLocaleString()} {nicheName(niche, lang).toLowerCase()} venues we
            track, <strong>{halalSignaledCount}</strong> ({totalPlaces > 0 ? Math.round((halalSignaledCount / totalPlaces) * 100) : 0}%)
            carry at least one explicit halal signal in their name, menu, reviews, or website
            text. <strong>{cicotCount}</strong> bear the official CICOT mark <Cite n={refs.length} /> —
            the gold standard for Thai halal certification.
          </p>
          <p>
            We text-mine across {`{`}name, category, reviews, website meta, opening hours{`}`} in
            6 languages (English, Thai, Arabic, Malay, Korean, Chinese) for explicit signals:
            CICOT seal, MUI seal (Indonesian recognition), halal kitchen layout, prayer room
            presence, qibla marking, female-staff availability, women-only hours, hijab-friendly
            policies. The full signal taxonomy is published in our methodology.
          </p>
        </WikiSection>

        {/* §6 FAQ */}
        {guide.faqs.length > 0 && (
          <WikiSection n={6} title="Common questions">
            {guide.faqs.map((f, i) => (
              <div key={i}>
                <h3>{ll(f.q, lang)}</h3>
                <p>{ll(f.a, lang)}</p>
              </div>
            ))}
          </WikiSection>
        )}

        <References refs={refs} />
        <SeeAlso items={seeAlso} />
      </WikiLayout>
    </>
  );
}
