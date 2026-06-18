import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlacesByNiche, getPlacesLiteByNiche, loadCommunity, isIndexable } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";
import { NICHE_GUIDES, EMPTY_GUIDE, ll } from "@/lib/niche-content";
import CategoryClient from "@/components/CategoryClient";
import { loadPlaces as _loadAll } from "@/lib/data";
import PlacePhoto from "@/components/PlacePhoto";

// All 34 niches now get a standalone category page. The original 6 have curated
// editorial guides (NICHE_GUIDES); the 28 expanded niches fall back to a basic
// (but non-empty) page built from their place list. Thin ones are noindex'd via
// categoryIsThin so low-quality pages never enter the index.
const NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
  "halal-arab", "halal-bakery", "halal-bbq", "halal-buffet", "halal-burger",
  "halal-cafe", "halal-cooking-class", "halal-grocery", "halal-indian",
  "halal-japanese", "halal-korean", "halal-mediterranean", "halal-pizza",
  "halal-seafood", "halal-shisha-cafe", "halal-street-food", "halal-thai",
  "halal-laundry", "halal-pharmacy", "iftar-buffet", "modest-fashion",
  "muslim-attractions", "muslim-driver", "muslim-friendly-spa", "muslim-wedding",
  "prayer-room", "southern-muslim", "arabic-school",
];

export const dynamic = "force-static";

// A category page with too few indexable places is thin content — keep it
// browsable but noindex it (and drop it from the sitemap) so it can't drag down
// site-wide quality signals. Tune alongside the sitemap CATEGORY filter.
const CATEGORY_MIN_INDEXABLE = 5;
function categoryIsThin(niche: Niche): boolean {
  return getPlacesByNiche(niche).filter(isIndexable).length < CATEGORY_MIN_INDEXABLE;
}

// Intro paragraph for the category page + its meta description. Uses the curated
// guide when present; otherwise a non-empty fallback so the 28 expanded niches
// (no curated guide yet) don't render an empty Overview / thin meta description.
function introText(niche: Niche, lang: Lang): string {
  const curated = ll((NICHE_GUIDES[niche] ?? EMPTY_GUIDE).intro, lang);
  if (curated) return curated;
  const count = getPlacesByNiche(niche).length;
  return `${nicheName(niche, lang)} in Thailand — ${count} verified, cross-checked listings on ${SITE.name}, scored across independent sources with no paid promotion.`;
}

export function generateStaticParams() {
  const params: Array<{ lang: Lang; niche: Niche }> = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const niche of NICHES) {
      params.push({ lang, niche });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { lang: Lang; niche: Niche } }): Promise<Metadata> {
  const { lang, niche } = params;
  if (!NICHES.includes(niche)) return {};
  const url = `${SITE.origin}/${lang}/c/${niche}/`;
  const title = `${nicheName(niche, lang)} in Thailand — ${SITE.name}`;
  const description = introText(niche, lang).slice(0, 200);
  return {
    title,
    description,
    // Thin categories (e.g. halal-beauty/clinic with <5 indexable places) stay
    // browsable but are kept out of the index to protect site-wide quality.
    robots: categoryIsThin(niche) ? { index: false, follow: true } : undefined,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/c/${niche}/`])),
        "x-default": `${SITE.origin}/en/c/${niche}/`,
      },
    },
    openGraph: { title, description, url },
  };
}

export default function CategoryPage({ params }: { params: { lang: Lang; niche: Niche } }) {
  const { lang, niche } = params;
  if (!NICHES.includes(niche)) notFound();

  const places = getPlacesByNiche(niche);
  const community = loadCommunity(niche);
  const meta = NICHE_META[niche];
  const guide = NICHE_GUIDES[niche] ?? EMPTY_GUIDE;

  // Cross-link: other niches that have data (skip current + empty)
  const allBundle = _loadAll();
  const relatedNiches = NICHES
    .filter((n) => n !== niche && (((allBundle.by_niche as any)[n] ?? 0) > 0));

  // JSON-LD: BreadcrumbList + FAQPage (for AEO — AI search engines cite these)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.origin },
        { "@type": "ListItem", position: 2, name: nicheName(niche, lang), item: `${SITE.origin}/${lang}/c/${niche}/` },
      ],
    },
    // Only emit FAQPage when there are real FAQs — expanded niches use
    // EMPTY_GUIDE (no FAQs) and an empty FAQPage is invalid structured data.
    ...(guide.faqs.length > 0
      ? [{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((f) => ({
            "@type": "Question",
            name: ll(f.q, lang),
            acceptedAnswer: { "@type": "Answer", text: ll(f.a, lang) },
          })),
        }]
      : []),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${nicheName(niche, lang)} in Thailand — Verified Guide`,
      datePublished: "2026-05-25",
      dateModified: new Date().toISOString().slice(0, 10),
      author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      mainEntityOfPage: `${SITE.origin}/${lang}/c/${niche}/`,
      description: introText(niche, lang).slice(0, 250),
    },
  ];

  const isArabic = lang === "ar";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <nav className="mt-6 text-xs muted">
          <Link href={`/${lang}/`} className="hover:underline">{SITE.name}</Link>
          <span className="mx-2">/</span>
          <span>{nicheName(niche, lang)}</span>
        </nav>

        {/* HERO — editorial style with gold accent + Islamic stars */}
        <header className="relative mt-4 overflow-hidden rounded-3xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 px-6 py-12 dark:border-islam-800/60 dark:from-islam-950/60 dark:via-ink-900 dark:to-gold-950/40 sm:px-12 sm:py-16">
          <div className="bg-islamic-stars absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-islam-700 dark:text-islam-300">
              <span>Verified Guide</span>
              <span aria-hidden="true">·</span>
              <span>{places.length.toLocaleString()} {t("places_count", lang)}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl">{meta.emoji}</span>
              <h1 className="text-3xl font-black tracking-tight text-islam-950 dark:text-islam-50 sm:text-5xl">
                {nicheName(niche, lang)}
                <span className="text-gradient-gold"> · Thailand</span>
              </h1>
            </div>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-700 dark:text-ink-200 sm:text-lg">
              {nicheTagline(niche, lang)}
            </p>
          </div>
        </header>

        {/* INTRO / OVERVIEW — wiki-style framing */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_280px]">
          <article className="prose prose-sm max-w-none text-ink-800 dark:text-ink-200 sm:prose-base">
            <h2 className="!mb-3 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
              <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">١</span>
              Overview
            </h2>
            <p className={`text-[15px] leading-relaxed ${isArabic ? "font-arabic" : ""}`} dir={isArabic ? "rtl" : "ltr"}>
              {introText(niche, lang)}
            </p>
          </article>

          <aside className="rounded-2xl border border-gold-300/70 bg-gold-50/60 p-5 text-sm dark:border-gold-700/50 dark:bg-gold-950/30">
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gold-800 dark:text-gold-300">
              At a glance
            </div>
            <dl className="space-y-2.5">
              <div>
                <dt className="text-[10px] uppercase tracking-wide muted">Verified places</dt>
                <dd className="font-black tabular-nums text-islam-900 dark:text-islam-100">
                  {places.length.toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide muted">Sources cross-checked</dt>
                <dd className="font-bold text-ink-800 dark:text-ink-200">6 independent</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide muted">Languages covered</dt>
                <dd className="font-bold text-ink-800 dark:text-ink-200">EN · KO · TH · ZH · JA · AR</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide muted">Last updated</dt>
                <dd className="font-bold text-ink-800 dark:text-ink-200">{new Date().toISOString().slice(0, 10)}</dd>
              </div>
            </dl>
          </aside>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            VERIFIED PLACES — Editorial mosaic
            (1) Featured hero    — top trust place, full-width hero
            (2) Top 5 ranked     — numbered, premium 카드
            (3) By city          — horizontal scroll, top 3 per city
            (4) Browse all       — CategoryClient (filter/search/sort)
           ═══════════════════════════════════════════════════════════ */}
        {places.length === 0 ? (
          <section className="mt-14">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
              <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٢</span>
              Verified places
            </h2>
            <div className="rounded-2xl border border-dashed border-islam-300 bg-islam-50/50 p-8 text-center dark:border-islam-700 dark:bg-islam-950/30">
              <div className="text-3xl">{meta.emoji}</div>
              <p className="mt-2 text-base font-bold text-islam-900 dark:text-islam-100">{t("coming_soon", lang)}</p>
              <p className="mt-1 text-sm muted">{t("coming_soon_msg", lang)}</p>
            </div>
          </section>
        ) : (() => {
          const sorted = [...places].sort((a, b) => b.trust_score - a.trust_score);
          const featured = sorted[0];
          const ranked = sorted.slice(1, 6); // ranks 2–6
          // group by city: top 3 per city (cities with ≥3 places only)
          const byCity = new Map<string, typeof sorted>();
          for (const p of sorted) {
            if (!p.city) continue;
            const arr = byCity.get(p.city) ?? [];
            arr.push(p);
            byCity.set(p.city, arr);
          }
          const cityGroups = [...byCity.entries()]
            .filter(([, arr]) => arr.length >= 3)
            .sort((a, b) => b[1].length - a[1].length)
            .slice(0, 4);

          const featTopReview = featured.top_review_text
            ? `"${featured.top_review_text.slice(0, 180).replace(/\s+\S*$/, "")}${featured.top_review_text.length > 180 ? "…" : ""}"`
            : null;

          return (
            <>
              {/* ────── FEATURED TOP PICK ────── */}
              <section className="mt-14">
                <div className="eyebrow mb-2">Featured · Editor's pick</div>
                <h2 className="h-display mb-6 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                  Top of {nicheName(niche, lang)}
                </h2>
                <Link
                  href={`/${lang}/place/${featured.slug}/`}
                  className="card-editorial group relative grid overflow-hidden lg:grid-cols-[1.4fr_1fr]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:min-h-[420px]">
                    <PlacePhoto
                      niche={featured.niche}
                      name={featured.name}
                      slug={featured.slug}
                      photoUrl={featured.top_photo_url}
                      trustScore={featured.trust_score}
                      sourceCount={Object.values(featured.source_badges).filter((v) => v > 0).length}
                      halalSignals={featured.halal_signals_detected}
                      languages={featured.languages}
                      className="absolute inset-0 h-full w-full"
                      rounded=""
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-md bg-gold-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-islam-950">
                        ★ #1 PICK
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-6 p-7 sm:p-9">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-display text-4xl font-bold tabular-nums text-gold-700 dark:text-gold-400">
                          {featured.trust_score}
                        </span>
                        <div className="border-l border-ink-200 pl-3 dark:border-ink-700">
                          <div className="text-[10px] uppercase tracking-wider muted">Trust</div>
                          <div className="text-[10px] uppercase tracking-wider muted">/ 100</div>
                        </div>
                      </div>
                      <h3 className="mt-4 font-display text-3xl leading-tight text-islam-950 dark:text-islam-50 sm:text-4xl">
                        {featured.name}
                      </h3>
                      <div className="mt-2 text-sm muted">
                        {featured.city && <>📍 {featured.city}</>}
                        {featured.rating != null && (
                          <>
                            {featured.city && " · "}
                            <span className="text-gold-700 dark:text-gold-400">★ {featured.rating.toFixed(1)}</span>
                            {featured.review_count ? ` (${featured.review_count.toLocaleString()})` : ""}
                          </>
                        )}
                      </div>
                      {featTopReview && (
                        <blockquote className="mt-5 border-l-2 border-gold-500 pl-4 font-display text-base italic leading-relaxed text-ink-800 dark:text-ink-200">
                          {featTopReview}
                        </blockquote>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        {featured.is_halal_signaled && (
                          <span className="rounded-full bg-gold-100 px-2 py-0.5 font-bold text-gold-800 dark:bg-gold-950/40 dark:text-gold-300">
                            ☪ Halal signal
                          </span>
                        )}
                        {featured.languages.ko && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">🇰🇷 KO</span>
                        )}
                        {featured.languages.ar && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">🇸🇦 AR</span>
                        )}
                      </div>
                      <span className="font-display text-xl text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                    </div>
                  </div>
                </Link>
              </section>

              {/* ────── TOP 5 NUMBERED RANKING ────── */}
              {ranked.length > 0 && (
                <section className="mt-16">
                  <div className="eyebrow mb-2">Ranked by Trust Score</div>
                  <h2 className="h-display mb-6 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                    Top picks — runners-up
                  </h2>
                  <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {ranked.map((p, i) => (
                      <li key={p.id}>
                        <Link
                          href={`/${lang}/place/${p.slug}/`}
                          className="card-editorial group relative flex h-full flex-col gap-3 overflow-hidden"
                        >
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <PlacePhoto
                              niche={p.niche}
                              name={p.name}
                              slug={p.slug}
                              photoUrl={p.top_photo_url}
                              trustScore={p.trust_score}
                              halalSignals={p.halal_signals_detected}
                              languages={p.languages}
                              className="absolute inset-0 h-full w-full"
                              rounded=""
                            />
                            {/* Big rank number */}
                            <div className="absolute left-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-islam-950/90 text-white shadow-md">
                              <span className="font-display text-base font-bold">{i + 2}</span>
                            </div>
                            <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-black tabular-nums shadow-sm text-islam-900">
                              {p.trust_score}
                            </span>
                          </div>
                          <div className="px-3 pb-3">
                            <h3 className="line-clamp-2 font-display text-sm font-bold leading-tight text-islam-950 dark:text-islam-50">
                              {p.name}
                            </h3>
                            <div className="mt-1 text-[11px] muted">
                              {p.city && <>📍 {p.city}</>}
                              {p.rating != null && <> · ★ {p.rating.toFixed(1)}</>}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* ────── BY CITY ────── */}
              {cityGroups.length > 0 && (
                <section className="mt-16">
                  <div className="eyebrow mb-2">By destination</div>
                  <h2 className="h-display mb-6 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                    Where to go
                  </h2>
                  <div className="space-y-10">
                    {cityGroups.map(([city, list]) => (
                      <div key={city}>
                        <div className="mb-4 flex items-baseline justify-between">
                          <h3 className="font-display text-xl font-bold text-islam-900 dark:text-islam-100">
                            📍 {city}
                          </h3>
                          <span className="text-xs muted">
                            {list.length} {t("places_count", lang)}
                          </span>
                        </div>
                        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] sm:mx-0 sm:px-0">
                          {list.slice(0, 6).map((p) => (
                            <Link
                              key={p.id}
                              href={`/${lang}/place/${p.slug}/`}
                              className="card-editorial group flex w-[260px] shrink-0 flex-col gap-3 overflow-hidden"
                            >
                              <div className="relative aspect-[4/3] w-full overflow-hidden">
                                <PlacePhoto
                                  niche={p.niche}
                                  name={p.name}
                                  slug={p.slug}
                                  photoUrl={p.top_photo_url}
                                  trustScore={p.trust_score}
                                  halalSignals={p.halal_signals_detected}
                                  languages={p.languages}
                                  className="absolute inset-0 h-full w-full"
                                  rounded=""
                                />
                                <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-black tabular-nums shadow-sm text-islam-900">
                                  {p.trust_score}
                                </span>
                              </div>
                              <div className="px-3 pb-3">
                                <h4 className="line-clamp-2 font-display text-sm font-bold leading-tight text-islam-950 dark:text-islam-50">
                                  {p.name}
                                </h4>
                                {p.rating != null && (
                                  <div className="mt-1 text-[11px] text-gold-700 dark:text-gold-400">
                                    ★ {p.rating.toFixed(1)}
                                    {p.review_count ? <span className="muted"> ({p.review_count.toLocaleString()})</span> : null}
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ────── BROWSE ALL (filter/search/sort) ────── */}
              <section className="mt-16">
                <div className="eyebrow mb-2">Browse all</div>
                <h2 className="h-display mb-6 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                  Search · filter · sort
                </h2>
                <CategoryClient places={getPlacesLiteByNiche(niche)} lang={lang} niche={niche} />
              </section>
            </>
          );
        })()}

        {/* WHAT TO LOOK FOR — evaluation criteria */}
        <section className="mt-16">
          <h2 className="mb-1 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
            <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٣</span>
            What to look for
          </h2>
          <p className="mb-6 text-sm muted">
            How to evaluate a {nicheName(niche, lang).toLowerCase()} venue before committing.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {guide.criteria.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl border border-islam-100 bg-white p-5 transition hover:border-gold-300 hover:shadow-md dark:border-islam-800/40 dark:bg-ink-900"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold-100 text-xs font-black text-gold-800 dark:bg-gold-900/50 dark:text-gold-200">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-bold text-islam-900 dark:text-islam-100">
                    {ll(c.title, lang)}
                  </h3>
                </div>
                <p className="text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
                  {ll(c.body, lang)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CITY SPOTLIGHTS — geographic breakdown */}
        <section className="mt-16">
          <h2 className="mb-1 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
            <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٤</span>
            City spotlights
          </h2>
          <p className="mb-6 text-sm muted">Where to focus by destination.</p>
          <div className="space-y-4">
            {guide.citySpotlights.map((cs, i) => (
              <article
                key={i}
                className="rounded-2xl border-l-4 border-islam-500 bg-islam-50/40 px-5 py-4 dark:border-islam-600 dark:bg-islam-950/20"
              >
                <h3 className="mb-1 flex items-center gap-2 text-base font-bold text-islam-900 dark:text-islam-100">
                  <span aria-hidden="true">📍</span>
                  {cs.city}
                </h3>
                <p className="text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
                  {ll(cs.body, lang)}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ — AEO gold */}
        <section className="mt-16">
          <h2 className="mb-1 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
            <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٥</span>
            Frequently asked
          </h2>
          <p className="mb-6 text-sm muted">
            Real questions from muslim travelers and residents. Schema-tagged for AI search engines.
          </p>
          <div className="divide-y divide-islam-100 rounded-2xl border border-islam-100 bg-white dark:divide-islam-800/40 dark:border-islam-800/40 dark:bg-ink-900">
            {guide.faqs.map((f, i) => (
              <details key={i} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-sm font-bold text-islam-900 dark:text-islam-100">
                  <span className="flex-1">{ll(f.q, lang)}</span>
                  <span className="shrink-0 text-gold-600 transition group-open:rotate-45 dark:text-gold-400" aria-hidden="true">
                    ✚
                  </span>
                </summary>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
                  {ll(f.a, lang)}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* COMMUNITY DISCUSSIONS — niche-level Reddit + Pantip + Naver */}
        {community && (community.top_reddit.length + community.top_pantip.length + community.top_naver.length > 0) && (
          <section className="mt-16">
            <h2 className="mb-1 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
              <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٦</span>
              {t("community_discussions", lang)}
            </h2>
            <p className="mb-6 max-w-2xl text-sm muted">{t("community_blurb", lang)}</p>

            {community.top_reddit.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-islam-900 dark:text-islam-100">
                  <span>💬</span> Reddit
                  <span className="text-xs font-normal muted">({community.counts.reddit.toLocaleString()} threads)</span>
                </h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {community.top_reddit.slice(0, 8).map((tr, i) => (
                    <li key={`r-${i}`}>
                      <a href={tr.url} target="_blank" rel="nofollow noopener" className="block rounded-xl border border-ink-100 bg-white p-3 transition hover:border-orange-400 hover:shadow dark:border-ink-800 dark:bg-ink-900">
                        <div className="text-xs muted">
                          r/{tr.subreddit || "all"} {tr.score ? `· ${tr.score}↑` : ""} {tr.comments ? `· ${tr.comments} comments` : ""}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{tr.title}</div>
                        {tr.snippet && <div className="mt-1 line-clamp-2 text-xs muted">{tr.snippet}</div>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {community.top_pantip.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-islam-900 dark:text-islam-100">
                  <span>🇹🇭</span> Pantip
                  <span className="text-xs font-normal muted">({community.counts.pantip.toLocaleString()} threads)</span>
                </h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {community.top_pantip.slice(0, 6).map((tr, i) => (
                    <li key={`p-${i}`}>
                      <a href={tr.url} target="_blank" rel="nofollow noopener" className="block rounded-xl border border-ink-100 bg-white p-3 transition hover:border-fuchsia-400 hover:shadow dark:border-ink-800 dark:bg-ink-900">
                        <div className="text-xs muted">
                          Pantip {tr.score ? `· ${tr.score}♥` : ""} {tr.comments ? `· ${tr.comments} replies` : ""}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{tr.title}</div>
                        {tr.snippet && <div className="mt-1 line-clamp-2 text-xs muted">{tr.snippet}</div>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {community.top_naver.length > 0 && (
              <div>
                <h3 className="mb-3 inline-flex items-center gap-2 text-base font-bold text-islam-900 dark:text-islam-100">
                  <span>🇰🇷</span> Naver Blog
                  <span className="text-xs font-normal muted">({community.counts.naver.toLocaleString()} posts)</span>
                </h3>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {community.top_naver.slice(0, 6).map((tr, i) => (
                    <li key={`n-${i}`}>
                      <a href={tr.url} target="_blank" rel="nofollow noopener" className="block rounded-xl border border-ink-100 bg-white p-3 transition hover:border-emerald-400 hover:shadow dark:border-ink-800 dark:bg-ink-900">
                        <div className="text-xs muted">
                          Naver {tr.author ? `· ${tr.author}` : ""} {tr.date ? `· ${tr.date}` : ""}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm font-medium leading-snug">{tr.title}</div>
                        {tr.snippet && <div className="mt-1 line-clamp-2 text-xs muted">{tr.snippet}</div>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* CROSS-LINK — other categories with data */}
        {relatedNiches.length > 0 && (
          <section className="mt-16">
            <div className="eyebrow mb-2">Also browse</div>
            <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">
              Other muslim-friendly categories
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {relatedNiches.map((n) => {
                const m = NICHE_META[n];
                const count = (allBundle.by_niche as any)[n] ?? 0;
                return (
                  <Link
                    key={n}
                    href={`/${lang}/c/${n}/`}
                    className="card-editorial flex flex-col items-center gap-2 p-4 text-center"
                  >
                    <div className="text-3xl">{m.emoji}</div>
                    <div className="font-display text-sm font-bold leading-tight text-islam-950 dark:text-islam-50">
                      {nicheName(n, lang)}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gold-700 dark:text-gold-400">
                      {count} places
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <footer className="mt-20 border-t border-islam-200 pt-6 text-xs muted dark:border-islam-800/60">
          <p className="max-w-3xl">{t("footer_blurb", lang)}</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div>© {new Date().getFullYear()} {SITE.name}</div>
            <Link href={`/${lang}/`} className="hover:underline">← {t("back_to_all", lang)}</Link>
          </div>
        </footer>
      </main>
    </>
  );
}
