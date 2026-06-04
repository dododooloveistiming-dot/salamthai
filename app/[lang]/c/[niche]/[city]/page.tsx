// Programmatic SEO: niche × city landing pages.
// e.g. /en/c/halal-food/bangkok, /th/c/iftar-buffet/phuket
//
// Reuses the global CategoryClient but pre-filters to city. Each page emits
// its own BreadcrumbList + ItemList + CollectionPage JSON-LD so Google +
// LLMs can cite "Best halal food in Bangkok" style queries.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlacesByNiche, toPlaceLite } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Niche, Place } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";
import CategoryClient from "@/components/CategoryClient";
import PlacePhoto from "@/components/PlacePhoto";

// Inlined city catalog (avoid wiki-registry import — Next 14 page validator on
// Vercel falsely treats those named imports as Page exports; see commit eabbcbd).
// Source of truth is still lib/wiki-registry.ts.
const CITIES = [
  { slug: "bangkok",     name: "Bangkok",     matchCities: ["Bangkok"] },
  { slug: "phuket",      name: "Phuket",      matchCities: ["Phuket"] },
  { slug: "krabi",       name: "Krabi",       matchCities: ["Krabi"] },
  { slug: "chiang-mai",  name: "Chiang Mai",  matchCities: ["Chiang Mai", "Chiangmai"] },
  { slug: "hat-yai",     name: "Hat Yai",     matchCities: ["Hat Yai", "Hatyai", "Songkhla"] },
  { slug: "pattaya",     name: "Pattaya",     matchCities: ["Pattaya"] },
  { slug: "hua-hin",     name: "Hua Hin",     matchCities: ["Hua Hin", "Huahin"] },
  { slug: "koh-samui",   name: "Koh Samui",   matchCities: ["Koh Samui", "Ko Samui"] },
  { slug: "ko-lanta",    name: "Ko Lanta",    matchCities: ["Ko Lanta", "Koh Lanta"] },
  { slug: "pattani",     name: "Pattani",     matchCities: ["Pattani", "Yala", "Narathiwat"] },
];

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

// Minimum places needed to publish a niche×city landing — avoids thin pages
// that hurt SEO. Tune later based on indexed-pages metrics.
const MIN_PLACES_PER_LANDING = 3;

export const dynamic = "force-static";

function citiesForNiche(niche: Niche): typeof CITIES {
  const places = getPlacesByNiche(niche);
  return CITIES.filter((c) => {
    const count = places.filter((p) =>
      p.city && c.matchCities.some((m) => m.toLowerCase() === p.city.toLowerCase())
    ).length;
    return count >= MIN_PLACES_PER_LANDING;
  });
}

export function generateStaticParams() {
  const params: Array<{ lang: Lang; niche: Niche; city: string }> = [];
  for (const niche of NICHES) {
    const cities = citiesForNiche(niche);
    for (const lang of SUPPORTED_LANGS) {
      for (const c of cities) {
        params.push({ lang, niche, city: c.slug });
      }
    }
  }
  return params;
}

function findCityEntry(slug: string) {
  return CITIES.find((c) => c.slug === slug);
}

function placesInCity(niche: Niche, citySlug: string): Place[] {
  const city = findCityEntry(citySlug);
  if (!city) return [];
  return getPlacesByNiche(niche).filter((p) =>
    p.city && city.matchCities.some((m) => m.toLowerCase() === p.city.toLowerCase())
  );
}

export async function generateMetadata({ params }: { params: { lang: Lang; niche: Niche; city: string } }): Promise<Metadata> {
  const { lang, niche, city } = params;
  if (!NICHES.includes(niche)) return {};
  const cityEntry = findCityEntry(city);
  if (!cityEntry) return {};
  const places = placesInCity(niche, city);
  if (places.length < MIN_PLACES_PER_LANDING) return {};

  const nicheLabel = nicheName(niche, lang);
  const url = `${SITE.origin}/${lang}/c/${niche}/${city}/`;
  const title = `${places.length} ${nicheLabel} in ${cityEntry.name} — Verified ${new Date().getFullYear()}`;
  const description =
    `${places.length} cross-verified ${nicheLabel.toLowerCase()} options in ${cityEntry.name}, Thailand. ` +
    `Trust scores from 8 independent sources — no paid promotion. Halal signals, Arabic reviews, ` +
    `community-checked.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/c/${niche}/${city}/`])),
        "x-default": `${SITE.origin}/en/c/${niche}/${city}/`,
      },
    },
    openGraph: { title, description, url },
  };
}

export default function NicheCityPage({ params }: { params: { lang: Lang; niche: Niche; city: string } }) {
  const { lang, niche, city } = params;
  if (!NICHES.includes(niche)) notFound();
  const cityEntry = findCityEntry(city);
  if (!cityEntry) notFound();

  const places = placesInCity(niche, city);
  if (places.length < MIN_PLACES_PER_LANDING) notFound();

  const meta = NICHE_META[niche];
  const nicheLabel = nicheName(niche, lang);
  const tagline = nicheTagline(niche, lang);

  // Top 5 by trust for the highlighted strip
  const top5 = [...places].sort((a, b) => b.trust_score - a.trust_score).slice(0, 5);
  const avgTrust = Math.round(places.reduce((s, p) => s + p.trust_score, 0) / places.length);

  // Programmatic FAQ stats (AEO: LLMs cite Q&A blocks with concrete numbers)
  const top1 = top5[0];
  const cicotCount = places.filter((p) => p.cicot_mentioned).length;
  const halalSignaledCount = places.filter((p) => p.is_halal_signaled).length;
  const open24hCount = places.filter((p) => p.is_open_24h).length;
  const avgRating = (() => {
    const rated = places.filter((p) => p.rating != null);
    if (rated.length === 0) return null;
    return (rated.reduce((s, p) => s + (p.rating || 0), 0) / rated.length).toFixed(1);
  })();
  const cityNames = cityEntry.matchCities.join(", ");
  const niceCity = cityEntry.name;

  const faqs: Array<{ q: string; a: string }> = [
    {
      q: `How many ${nicheLabel.toLowerCase()} are verified in ${niceCity}?`,
      a: `Salaam Thailand catalogs ${places.length} ${nicheLabel.toLowerCase()} in ${niceCity}, each cross-checked across up to 8 independent public-data sources. The average Trust Score is ${avgTrust}/100.`,
    },
    {
      q: `What is the highest-trust ${nicheLabel.toLowerCase().replace(/s$/, "")} in ${niceCity}?`,
      a: top1
        ? `${top1.name} currently holds the highest Trust Score in ${niceCity} at ${top1.trust_score}/100${top1.rating ? `, with a Google rating of ${top1.rating.toFixed(1)}` : ""}${top1.review_count ? ` from ${top1.review_count.toLocaleString()} reviews` : ""}.`
        : `No place has been verified yet in this niche × city combination.`,
    },
    ...(cicotCount > 0 ? [{
      q: `Which ${nicheLabel.toLowerCase()} in ${niceCity} have CICOT halal certification?`,
      a: `Out of ${places.length} ${nicheLabel.toLowerCase()} in ${niceCity}, ${cicotCount} mention CICOT (Central Islamic Council of Thailand) certification in their public data — name, category, or reviews. Each is flagged on the place's detail page.`,
    }] : []),
    ...(halalSignaledCount > 0 ? [{
      q: `What halal signals are common among ${niceCity} ${nicheLabel.toLowerCase()}?`,
      a: `${halalSignaledCount} of the ${places.length} ${nicheLabel.toLowerCase()} in ${niceCity} have detected halal signals — keywords like "halal-certified", "muslim-friendly", "no alcohol", "prayer room", or Arabic signage found in their name, category, reviews, or website text.`,
    }] : []),
    ...(open24hCount > 0 ? [{
      q: `Are there 24-hour ${nicheLabel.toLowerCase()} in ${niceCity}?`,
      a: `Yes — ${open24hCount} ${nicheLabel.toLowerCase()} in ${niceCity} report 24-hour operation. Useful for late-arrival flights or post-iftar visits during Ramadan.`,
    }] : []),
    ...(avgRating ? [{
      q: `What's the average rating of ${nicheLabel.toLowerCase()} in ${niceCity}?`,
      a: `Across ${places.length} verified ${nicheLabel.toLowerCase()} in ${niceCity}, the average Google rating is ${avgRating}/5. Trust Scores (which weight rating against source diversity and negative signals) average ${avgTrust}/100.`,
    }] : []),
    {
      q: `Is the ranking on Salaam Thailand sponsored or paid?`,
      a: `No. Salaam Thailand has no paid promotion, no sponsored slots, and no premium listings. Rankings are computed entirely from the Trust Score formula — see the methodology page for the exact calculation.`,
    },
  ];

  // JSON-LD: BreadcrumbList + CollectionPage + ItemList (top 10 places)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.origin },
        { "@type": "ListItem", position: 2, name: nicheLabel, item: `${SITE.origin}/${lang}/c/${niche}/` },
        { "@type": "ListItem", position: 3, name: cityEntry.name, item: `${SITE.origin}/${lang}/c/${niche}/${city}/` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${nicheLabel} in ${cityEntry.name}`,
      description: `${places.length} verified ${nicheLabel.toLowerCase()} options in ${cityEntry.name}`,
      url: `${SITE.origin}/${lang}/c/${niche}/${city}/`,
      numberOfItems: places.length,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: top5.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "LocalBusiness",
          name: p.name,
          address: p.address || cityEntry.name,
          aggregateRating: p.rating ? {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.review_count || 1,
          } : undefined,
          url: `${SITE.origin}/${lang}/place/${p.slug}/`,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-6xl px-4 pb-20">
        <nav className="mt-6 text-xs muted">
          <Link href={`/${lang}/`} className="hover:underline">{SITE.name}</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/c/${niche}/`} className="hover:underline">{nicheLabel}</Link>
          <span className="mx-2">/</span>
          <span>{cityEntry.name}</span>
        </nav>

        {/* HERO */}
        <header className="relative mt-4 overflow-hidden rounded-3xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 px-6 py-10 dark:border-islam-800/60 dark:from-islam-950/60 dark:via-ink-900 dark:to-gold-950/40 sm:px-12 sm:py-14">
          <div className="bg-islamic-stars absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-islam-700 dark:text-islam-300">
              <span>{cityEntry.name}, Thailand</span>
              <span aria-hidden="true">·</span>
              <span>{places.length.toLocaleString()} verified</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl">{meta.emoji}</span>
              <h1 className="text-3xl font-black tracking-tight text-islam-950 dark:text-islam-50 sm:text-5xl">
                {nicheLabel}
                <span className="text-gradient-gold"> · {cityEntry.name}</span>
              </h1>
            </div>
            <p className="mt-3 max-w-2xl text-base font-medium text-ink-700 dark:text-ink-200">
              {tagline}
            </p>
          </div>
        </header>

        {/* AT-A-GLANCE */}
        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="card-editorial p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider muted">Verified places</div>
            <div className="font-display text-3xl font-black text-islam-900 dark:text-islam-100">
              {places.length.toLocaleString()}
            </div>
          </div>
          <div className="card-editorial p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider muted">Average Trust</div>
            <div className="font-display text-3xl font-black text-islam-900 dark:text-islam-100">
              {avgTrust}<span className="text-base text-ink-500">/100</span>
            </div>
          </div>
          <div className="card-editorial p-4 text-center">
            <div className="text-[10px] uppercase tracking-wider muted">Sources / place</div>
            <div className="font-display text-3xl font-black text-gold-700 dark:text-gold-300">
              up to 8
            </div>
          </div>
        </section>

        {/* TOP PICKS — hierarchical: hero #1 + runners-up #2-5 */}
        {top5.length > 0 && (() => {
          const hero = top5[0];
          const runners = top5.slice(1);
          const heroSrcCount = Object.values(hero.source_badges).filter((v) => v > 0).length;
          return (
            <section className="mt-12">
              <div className="eyebrow mb-2">Editor's pick · highest trust in {cityEntry.name}</div>
              <h2 className="h-display mb-5 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                #1 — {hero.name}
              </h2>

              {/* TIER 1: Hero card for #1 — magazine-style spread */}
              <Link
                href={`/${lang}/place/${hero.slug}/`}
                className="card-editorial group block overflow-hidden transition hover:border-gold-400 hover:shadow-lg"
              >
                <div className="grid md:grid-cols-[1.6fr_1fr]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden md:aspect-auto md:min-h-[320px]">
                    <PlacePhoto
                      niche={hero.niche}
                      name={hero.name}
                      slug={hero.slug}
                      photoUrl={hero.top_photo_url}
                      trustScore={hero.trust_score}
                      sourceCount={heroSrcCount}
                      halalSignals={hero.halal_signals_detected}
                      languages={hero.languages}
                      className="absolute inset-0 h-full w-full"
                      rounded=""
                    />
                    <div className="absolute left-3 top-3 rounded-md bg-gold-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-islam-950 shadow">
                      ★ #1 PICK
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
                    <div className="text-[10px] uppercase tracking-widest text-gold-700 dark:text-gold-300">
                      Highest trust score in {cityEntry.name}
                    </div>
                    <h3 className="font-display text-2xl font-black leading-tight text-islam-950 dark:text-islam-50 sm:text-3xl">
                      {hero.name}
                    </h3>
                    <dl className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider muted">Trust</dt>
                        <dd className="font-display text-xl font-black text-islam-900 dark:text-islam-100">
                          {hero.trust_score}
                          <span className="text-xs muted">/100</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider muted">Sources</dt>
                        <dd className="font-display text-xl font-black text-islam-900 dark:text-islam-100">
                          {heroSrcCount}<span className="text-xs muted">/8</span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[9px] uppercase tracking-wider muted">Rating</dt>
                        <dd className="font-display text-xl font-black text-gold-700 dark:text-gold-300">
                          {hero.rating ? `★${hero.rating.toFixed(1)}` : "—"}
                        </dd>
                      </div>
                    </dl>
                    {hero.top_review_text && (
                      <p className="line-clamp-3 text-sm italic muted">
                        "{hero.top_review_text.slice(0, 200)}{hero.top_review_text.length > 200 ? "…" : ""}"
                      </p>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-islam-900 group-hover:text-gold-700 dark:text-islam-100">
                      Read the full profile <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </Link>

              {/* TIER 2: Runners-up — compact row of 4 */}
              {runners.length > 0 && (
                <div className="mt-8">
                  <div className="eyebrow mb-3">Ranked by trust score</div>
                  <h3 className="font-display mb-4 text-lg font-black text-islam-950 dark:text-islam-50">
                    Top picks — runners-up
                  </h3>
                  <ol className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    {runners.map((p, i) => (
                      <li key={p.id} className="card-editorial overflow-hidden transition hover:border-gold-400">
                        <Link href={`/${lang}/place/${p.slug}/`} className="block">
                          <div className="relative aspect-[4/3] w-full overflow-hidden">
                            <PlacePhoto
                              niche={p.niche}
                              name={p.name}
                              slug={p.slug}
                              photoUrl={p.top_photo_url}
                              trustScore={p.trust_score}
                              sourceCount={Object.values(p.source_badges).filter((v) => v > 0).length}
                              halalSignals={p.halal_signals_detected}
                              languages={p.languages}
                              className="absolute inset-0 h-full w-full"
                              rounded=""
                            />
                            <div className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-islam-900 text-xs font-black text-white shadow">
                              {i + 2}
                            </div>
                          </div>
                          <div className="p-3">
                            <div className="line-clamp-1 font-display text-sm font-bold text-islam-950 dark:text-islam-100">
                              {p.name}
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-[11px] muted">
                              {p.city && <span>📍 {p.city}</span>}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </section>
          );
        })()}

        {/* FULL LIST — CategoryClient handles filter/search/sort. */}
        <section className="mt-14">
          <div className="eyebrow mb-2">Browse all</div>
          <h2 className="h-display mb-5 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
            All {places.length} {nicheLabel.toLowerCase()} in {cityEntry.name}
          </h2>
          <CategoryClient lang={lang} niche={niche} places={places.map(toPlaceLite)} />
        </section>

        {/* PROGRAMMATIC FAQ — AEO core. Concrete data answers. */}
        <section className="mt-16">
          <div className="eyebrow mb-2">Frequently asked</div>
          <h2 className="h-display mb-5 text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
            {nicheLabel} in {niceCity} — common questions
          </h2>
          <dl className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="card-editorial p-5">
                <dt className="font-display text-base font-bold text-islam-950 dark:text-islam-50 sm:text-lg">
                  {f.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs muted">
            All answers computed from public data on{" "}
            <Link href={`/${lang}/how-we-verify/`} className="link-gold">our methodology page</Link>.
          </p>
        </section>

        {/* WIKI CITY GUIDE LINK — connect listing to editorial city guide */}
        <section className="mt-16">
          <Link
            href={`/${lang}/wiki/city/${cityEntry.slug}/`}
            className="card-editorial group flex items-center gap-4 p-5 transition hover:border-gold-400"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 text-2xl dark:from-rose-950/30 dark:to-amber-950/30">
              📖
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
                Long-form city guide
              </div>
              <div className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                Read the {cityEntry.name} muslim travel wiki →
              </div>
              <div className="mt-1 text-xs muted">
                Demographics, areas, mosques, eating-out culture, travel tips.
              </div>
            </div>
          </Link>
        </section>

        {/* CROSS-LINKS to other cities of same niche */}
        <section className="mt-12">
          <div className="eyebrow mb-2">Same category, other cities</div>
          <h2 className="h-display mb-5 text-xl text-islam-950 dark:text-islam-50">
            {nicheLabel} elsewhere in Thailand
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {citiesForNiche(niche)
              .filter((c) => c.slug !== city)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${lang}/c/${niche}/${c.slug}/`}
                    className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-islam-50 to-gold-50 text-xl dark:from-islam-950/40 dark:to-gold-950/30">
                      {meta.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                        {nicheLabel} in {c.name}
                      </div>
                      <div className="text-[11px] muted">
                        {placesInCity(niche, c.slug).length} verified
                      </div>
                    </div>
                    <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </>
  );
}
