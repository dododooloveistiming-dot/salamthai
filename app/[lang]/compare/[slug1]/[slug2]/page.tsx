// Compare-2-places page. Side-by-side decision helper for hotel/tour pages
// that user-research shows is the #1 muslim-traveler hesitation moment.
//
// Static-generated for the highest-trust pair per (city, niche). Other pairs
// resolve dynamically via getStaticParams catch-all.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlaceBySlug } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Place } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";
import PlacePhoto from "@/components/PlacePhoto";

export const dynamic = "force-static";
export const dynamicParams = true;   // unknown pairs render on demand

/** Pre-generate the top-trust pair within each (niche, city). Keeps build
 *  size sane: ~34 niches × ~10 cities × 6 langs = ~2K pages. */
export function generateStaticParams() {
  const bundle = loadPlaces();
  // Group by niche + city, take top 2 by trust
  const byKey = new Map<string, Place[]>();
  for (const p of bundle.places) {
    if (!p.city) continue;
    const key = `${p.niche}|${p.city.toLowerCase()}`;
    const arr = byKey.get(key) || [];
    arr.push(p);
    byKey.set(key, arr);
  }
  const params: Array<{ lang: Lang; slug1: string; slug2: string }> = [];
  for (const [, places] of byKey) {
    if (places.length < 2) continue;
    const sorted = [...places].sort((a, b) => b.trust_score - a.trust_score);
    for (const lang of SUPPORTED_LANGS) {
      params.push({ lang, slug1: sorted[0].slug, slug2: sorted[1].slug });
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: { lang: Lang; slug1: string; slug2: string } }): Metadata {
  const a = getPlaceBySlug(params.slug1);
  const b = getPlaceBySlug(params.slug2);
  if (!a || !b) return {};
  const url = `${SITE.origin}/${params.lang}/compare/${a.slug}/${b.slug}/`;
  const title = `${a.name} vs ${b.name} — verified comparison · ${SITE.name}`;
  const description =
    `Side-by-side comparison of ${a.name} (Trust ${a.trust_score}) and ${b.name} ` +
    `(Trust ${b.trust_score}). Cross-verified across 8 sources, no paid promotion.`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/compare/${a.slug}/${b.slug}/`])),
        "x-default": `${SITE.origin}/en/compare/${a.slug}/${b.slug}/`,
      },
    },
    openGraph: { title, description, url },
  };
}

function countSources(p: Place): number {
  return Object.values(p.source_badges).filter((v) => v > 0).length;
}

function PlaceColumn({ p, lang, side }: { p: Place; lang: Lang; side: "left" | "right" }) {
  const meta = NICHE_META[p.niche];
  const cat = nicheName(p.niche, lang);
  const srcCount = countSources(p);
  const tierColor =
    p.trust_score >= 70 ? "text-emerald-700 dark:text-emerald-300" :
    p.trust_score >= 45 ? "text-amber-700 dark:text-amber-300" :
                           "text-rose-600 dark:text-rose-400";
  return (
    <div className="flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <PlacePhoto
          niche={p.niche}
          name={p.name}
          slug={p.slug}
          photoUrl={p.top_photo_url}
          trustScore={p.trust_score}
          sourceCount={srcCount}
          halalSignals={p.halal_signals_detected}
          languages={p.languages}
          className="absolute inset-0 h-full w-full"
          rounded=""
        />
        <div className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest shadow ${side === "left" ? "bg-islam-900 text-white" : "bg-gold-500 text-islam-950"}`}>
          {side === "left" ? "OPTION A" : "OPTION B"}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wider muted">{meta.emoji} {cat}</div>
        <h2 className="mt-1 font-display text-xl font-black text-islam-950 dark:text-islam-50 sm:text-2xl">
          <Link href={`/${lang}/place/${p.slug}/`} className="hover:text-gold-700">
            {p.name}
          </Link>
        </h2>
        {p.city && <div className="mt-1 text-sm muted">📍 {p.city}</div>}
      </div>

      {/* Headline stats */}
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="card-editorial p-3">
          <dt className="text-[9px] uppercase tracking-wider muted">Trust</dt>
          <dd className={`font-display text-2xl font-black ${tierColor}`}>{p.trust_score}<span className="text-xs muted">/100</span></dd>
        </div>
        <div className="card-editorial p-3">
          <dt className="text-[9px] uppercase tracking-wider muted">Sources</dt>
          <dd className="font-display text-2xl font-black text-islam-900 dark:text-islam-100">{srcCount}<span className="text-xs muted">/8</span></dd>
        </div>
        <div className="card-editorial p-3">
          <dt className="text-[9px] uppercase tracking-wider muted">Rating</dt>
          <dd className="font-display text-2xl font-black text-gold-700 dark:text-gold-300">
            {p.rating ? `★${p.rating.toFixed(1)}` : "—"}
          </dd>
        </div>
      </dl>

      <Link
        href={`/${lang}/place/${p.slug}/`}
        className="mt-4 block rounded-xl bg-islam-900 px-4 py-3 text-center text-sm font-bold text-white hover:bg-islam-800"
      >
        Open full profile →
      </Link>
    </div>
  );
}

function Row({ label, a, b, fmt }: { label: string; a: unknown; b: unknown; fmt?: (v: unknown) => string }) {
  const fmtFn = fmt || ((v: unknown) => (v == null || v === "" || v === 0 ? "—" : String(v)));
  return (
    <tr className="border-b border-ink-100 last:border-0 dark:border-ink-800">
      <th scope="row" className="py-3 pr-4 text-left text-xs uppercase tracking-wider muted">{label}</th>
      <td className="py-3 px-3 text-sm font-bold text-islam-900 dark:text-islam-100">{fmtFn(a)}</td>
      <td className="py-3 px-3 text-sm font-bold text-islam-900 dark:text-islam-100">{fmtFn(b)}</td>
    </tr>
  );
}

export default function ComparePage({ params }: { params: { lang: Lang; slug1: string; slug2: string } }) {
  const { lang, slug1, slug2 } = params;
  const a = getPlaceBySlug(slug1);
  const b = getPlaceBySlug(slug2);
  if (!a || !b) notFound();

  const sameNiche = a.niche === b.niche;
  const sameCity = !!(a.city && b.city && a.city.toLowerCase() === b.city.toLowerCase());

  const fmtBool = (v: unknown) => v ? "✓ yes" : "—";
  const fmtCount = (v: unknown) => (typeof v === "number" && v > 0 ? v.toLocaleString() : "—");

  // JSON-LD: ComparisonPage isn't standard, but ItemList is fine here
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${a.name} vs ${b.name}`,
    itemListElement: [a, b].map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: p.name,
        address: p.address || p.city,
        aggregateRating: p.rating ? {
          "@type": "AggregateRating",
          ratingValue: p.rating,
          reviewCount: p.review_count || 1,
        } : undefined,
        url: `${SITE.origin}/${lang}/place/${p.slug}/`,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <nav className="mt-6 text-xs muted">
          <Link href={`/${lang}/`} className="hover:underline">{SITE.name}</Link>
          <span className="mx-2">/</span>
          <span>Compare</span>
        </nav>

        {/* HERO */}
        <header className="mt-4">
          <div className="eyebrow mb-2">Decision helper</div>
          <h1 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-5xl">
            {a.name} <span className="text-gradient-gold">vs</span> {b.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm muted">
            Side-by-side comparison. Same data both columns — no paid promotion influencing
            which one ranks above the other. Pick the one your traveling style needs.
          </p>
        </header>

        {/* COLUMN COMPARISON */}
        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <PlaceColumn p={a} lang={lang} side="left" />
          <PlaceColumn p={b} lang={lang} side="right" />
        </section>

        {/* FACT TABLE */}
        <section className="mt-12 overflow-hidden rounded-2xl border border-ink-100 dark:border-ink-800">
          <table className="w-full">
            <thead className="bg-islam-50/60 dark:bg-islam-950/30">
              <tr>
                <th className="py-3 pl-4 text-left text-[10px] uppercase tracking-widest muted">Facts</th>
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-widest muted">{a.name.slice(0, 30)}</th>
                <th className="py-3 px-3 text-left text-[10px] uppercase tracking-widest muted">{b.name.slice(0, 30)}</th>
              </tr>
            </thead>
            <tbody>
              <Row label="Trust Score" a={a.trust_score} b={b.trust_score} fmt={(v) => `${v}/100`} />
              <Row label="Google rating" a={a.rating} b={b.rating} fmt={(v) => v ? `★ ${(v as number).toFixed(1)}` : "—"} />
              <Row label="Reviews" a={a.review_count} b={b.review_count} fmt={fmtCount} />
              <Row label="Scraped reviews" a={a.reviews_scraped_count} b={b.reviews_scraped_count} fmt={fmtCount} />
              <Row label="Photos" a={a.photos_count} b={b.photos_count} fmt={fmtCount} />
              <Row label="Videos" a={a.videos_count} b={b.videos_count} fmt={fmtCount} />
              <Row label="Halal signal count" a={a.halal_signal_count} b={b.halal_signal_count} fmt={fmtCount} />
              <Row label="CICOT mentioned" a={a.cicot_mentioned} b={b.cicot_mentioned} fmt={fmtBool} />
              <Row label="OSM verified" a={a.has_osm} b={b.has_osm} fmt={fmtBool} />
              <Row label="Wikipedia entry" a={a.has_wikipedia} b={b.has_wikipedia} fmt={fmtBool} />
              <Row label="Arabic reviews (Booking)" a={a.arabic_review_count} b={b.arabic_review_count} fmt={fmtCount} />
              <Row label="Open 24h" a={a.is_open_24h} b={b.is_open_24h} fmt={fmtBool} />
              <Row label="Beginner-friendly" a={a.is_beginner_friendly} b={b.is_beginner_friendly} fmt={fmtBool} />
              <Row label="Has Korean" a={a.languages.ko} b={b.languages.ko} fmt={fmtBool} />
              <Row label="Has Arabic" a={a.languages.ar} b={b.languages.ar} fmt={fmtBool} />
              <Row label="Phone" a={a.phone} b={b.phone} />
              <Row label="City" a={a.city} b={b.city} />
              <Row label="Price band" a={a.price_band} b={b.price_band} fmt={(v) => v === "unknown" ? "—" : String(v)} />
            </tbody>
          </table>
        </section>

        {/* HONEST DIFFERENCES BLURB */}
        <section className="mt-10 rounded-2xl border-l-4 border-gold-500 bg-gold-50 px-5 py-4 dark:bg-gold-950/30">
          <h3 className="font-display text-base font-black text-gold-900 dark:text-gold-100">
            Editor's note
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gold-900 dark:text-gold-100">
            {sameNiche && sameCity ? (
              <>Same category in the same city — your decision is mostly about which sources cross-verified each one. <strong>{(a.trust_score >= b.trust_score ? a : b).name}</strong> currently leads the Trust Score by {Math.abs(a.trust_score - b.trust_score)} points, but {(a.has_arabic_reviews ? a : b.has_arabic_reviews ? b : a).name} has the richer GCC traveler signal.</>
            ) : !sameNiche ? (
              <>These are different categories ({nicheName(a.niche, lang)} vs {nicheName(b.niche, lang)}) — direct comparison isn't apples-to-apples. Use the fact table to see what each lists.</>
            ) : (
              <>Same category, different cities ({a.city} vs {b.city}). Choose by which city fits your trip.</>
            )}
          </p>
        </section>

        <p className="mt-8 text-center text-xs muted">
          Want a different comparison?{" "}
          <Link href={`/${lang}/search/`} className="link-gold">Browse the directory</Link>{" "}
          and pair any two place URLs as <code>/compare/[slug-a]/[slug-b]/</code>.
        </p>
      </main>
    </>
  );
}
