import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlaceBySlug } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Place } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";
import StickyBookBar from "@/components/StickyBookBar";
import TrustGauge from "@/components/TrustGauge";
import BookingForm from "@/components/BookingForm";
import PrayerTimes from "@/components/PrayerTimes";
import { CITIES } from "@/lib/wiki-registry";

// Static-with-revalidate: page HTML is pre-rendered for SEO crawlers, but
// rebuilds every 12h so the embedded daily Prayer Times widget stays fresh.
export const revalidate = 43200;

export function generateStaticParams() {
  const bundle = loadPlaces();
  const params: Array<{ lang: Lang; slug: string }> = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const p of bundle.places) {
      params.push({ lang, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Promise<Metadata> {
  const place = getPlaceBySlug(params.slug);
  if (!place) return {};
  const url = `${SITE.origin}/${params.lang}/place/${place.slug}/`;
  const cat = nicheName(place.niche, params.lang);
  return {
    title: `${place.name} — ${cat} | ${SITE.name}`,
    description: `${place.city ? place.city + ". " : ""}Trust Score ${place.trust_score}/100, cross-checked across ${countSources(place)} sources. ${t("sources_pitch", params.lang)}.`,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/place/${place.slug}/`])),
    },
    openGraph: {
      title: place.name,
      description: `${cat} · Trust Score ${place.trust_score}/100`,
      url,
      images: place.top_photo_url ? [{ url: place.top_photo_url, width: 1200, height: 630 }] : [],
    },
  };
}

function countSources(p: Place): number {
  return Object.values(p.source_badges).filter((v) => v > 0).length;
}

function trustTier(score: number): "high" | "mid" | "low" {
  if (score >= 70) return "high";
  if (score >= 45) return "mid";
  return "low";
}

function AffiliateCTA({ place, lang }: { place: Place; lang: Lang }) {
  const out: Array<{ label: string; href: string; primary?: boolean }> = [];
  if (place.affiliate.klook) out.push({ label: t("cta_book_klook", lang), href: place.affiliate.klook, primary: true });
  if (place.affiliate.viator) out.push({ label: t("cta_book_viator", lang), href: place.affiliate.viator });
  if (place.affiliate.getyourguide) out.push({ label: t("cta_book_gyg", lang), href: place.affiliate.getyourguide });
  if (place.niche === "muslim-hotel" || place.niche === "halal-tour") {
    if (place.affiliate.agoda) out.push({ label: t("cta_book_agoda", lang), href: place.affiliate.agoda });
  }
  if (place.affiliate.bookimed) out.push({ label: "Get Free Quote", href: place.affiliate.bookimed, primary: true });
  if (out.length === 0) return null;

  const primaryBtn = out.find((b) => b.primary) || out[0];
  const otherBtns = out.filter((b) => b !== primaryBtn);

  return (
    <div className="space-y-2">
      <a
        href={primaryBtn.href}
        target="_blank"
        rel="nofollow sponsored noopener"
        className="block w-full rounded-xl bg-islam-900 px-5 py-3.5 text-center text-sm font-bold text-white shadow-md transition hover:bg-islam-800 hover:shadow-lg"
      >
        {primaryBtn.label} →
      </a>
      {otherBtns.length > 0 && (
        <div className={`grid gap-2 ${otherBtns.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {otherBtns.map((b) => (
            <a
              key={b.label}
              href={b.href}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="rounded-xl border border-gold-400/60 bg-gold-50 px-3 py-2.5 text-center text-xs font-bold text-gold-900 transition hover:border-gold-500 hover:bg-gold-100 dark:bg-gold-950/30 dark:text-gold-200"
            >
              {b.label} →
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function PlaceDetailPage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang, slug } = params;
  const place = getPlaceBySlug(slug);
  if (!place) notFound();
  const meta = NICHE_META[place.niche];
  const cat = nicheName(place.niche, lang);
  const tier = trustTier(place.trust_score);
  const tierColor =
    tier === "high" ? "text-islam-700 dark:text-islam-300" :
    tier === "mid"  ? "text-gold-700 dark:text-gold-300" :
                      "text-rose-600 dark:text-rose-400";

  // Similar places — same niche, same city preferred, top-trust first.
  const allPlaces = loadPlaces().places;
  const sameNiche = allPlaces.filter((p) => p.niche === place.niche && p.slug !== place.slug);
  const sameCity = sameNiche.filter((p) => place.city && p.city === place.city);
  const similarPlaces = (sameCity.length >= 4 ? sameCity : sameNiche)
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 4);

  const sources = [
    { name: "Google",     value: place.source_badges.google_reviews, icon: "★" },
    { name: "Reddit",     value: place.source_badges.reddit, icon: "💬" },
    { name: "YouTube",    value: place.source_badges.videos, icon: "▶" },
    { name: "Naver",      value: place.source_badges.naver, icon: "🇰🇷" },
    { name: "Pantip",     value: place.source_badges.pantip, icon: "🇹🇭" },
    { name: "Photos",     value: place.source_badges.photos, icon: "📸" },
    { name: "Website",    value: place.source_badges.website, icon: "🔗" },
    { name: "Bookimed",   value: place.source_badges.bookimed, icon: "🏥" },
  ].filter((s) => s.value > 0);

  const hours = (() => {
    if (!place.opening_hours_json) return null;
    try { return JSON.parse(place.opening_hours_json) as Record<string, string>; }
    catch { return null; }
  })();

  const hasAffiliate =
    !!(place.affiliate.klook || place.affiliate.viator || place.affiliate.getyourguide || place.affiliate.agoda || place.affiliate.bookimed);

  // Brief intro — short, human-sounding. We lead with the strongest available
  // review quote (if present) and follow with one factual line; falls back to
  // a single tight sentence when reviews are missing.
  const introHead = place.top_review_text
    ? `"${place.top_review_text.slice(0, 220).replace(/\s+\S*$/, "")}${place.top_review_text.length > 220 ? "…" : ""}"`
    : null;

  const introFacts = (() => {
    const bits: string[] = [];
    if (place.city) bits.push(`${place.city}, Thailand`);
    if (place.rating) {
      bits.push(`★ ${place.rating.toFixed(1)}${place.review_count ? ` (${place.review_count.toLocaleString()} reviews)` : ""}`);
    }
    if (place.is_halal_signaled && place.halal_signals_detected) {
      const labels = place.halal_signals_detected.split(",").slice(0, 2);
      bits.push(`halal signal: ${labels.join(", ")}`);
    }
    bits.push(`cross-checked across ${sources.length} sources`);
    return bits.join(" · ");
  })();

  const reviewAuthor = place.reviews_sample[0]?.reviewer || "Google reviewer";

  // schema.org type per niche
  const schemaType =
    place.niche === "halal-food"    ? "Restaurant" :
    place.niche === "muslim-hotel"  ? "LodgingBusiness" :
    place.niche === "halal-tour"    ? "TouristAttraction" :
    place.niche === "mosque"        ? "PlaceOfWorship" :
    place.niche === "halal-clinic"  ? "MedicalBusiness" :
    place.niche === "halal-beauty"  ? "HealthAndBeautyBusiness" :
                                      "LocalBusiness";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: place.name,
      address: { "@type": "PostalAddress", streetAddress: place.address, addressLocality: place.city, addressCountry: "TH" },
      telephone: place.phone || undefined,
      url: place.website || undefined,
      image: place.top_photo_url || undefined,
      aggregateRating: place.rating
        ? { "@type": "AggregateRating", ratingValue: place.rating, reviewCount: place.review_count ?? 1, bestRating: 5 }
        : undefined,
      priceRange: place.price_band === "budget" ? "$" :
                  place.price_band === "mid" ? "$$" :
                  place.price_band === "premium" ? "$$$" :
                  place.price_band === "luxury" ? "$$$$" : undefined,
      keywords: [
        cat,
        place.is_halal_signaled ? "halal certified" : "muslim-friendly",
        place.languages.ko ? "Korean-friendly" : null,
        place.languages.ar ? "Arabic-friendly" : null,
      ].filter(Boolean).join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.origin },
        { "@type": "ListItem", position: 2, name: cat, item: `${SITE.origin}/${lang}/c/${place.niche}/` },
        { "@type": "ListItem", position: 3, name: place.name, item: `${SITE.origin}/${lang}/place/${place.slug}/` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ========== FULL-WIDTH HERO PHOTO ========== */}
      <section className="relative isolate h-[58vh] min-h-[420px] w-full overflow-hidden bg-islam-950">
        {place.top_photo_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.top_photo_url}
              alt={place.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-islam-950 via-islam-950/70 to-islam-950/20" aria-hidden="true" />
          </>
        ) : (
          <>
            <div className="bg-islamic-stars absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-30">{meta.emoji}</div>
            <div className="absolute inset-0 bg-gradient-to-br from-islam-950 via-islam-900 to-emerald-950" aria-hidden="true" />
          </>
        )}

        <div className="relative mx-auto flex h-full max-w-5xl flex-col justify-end px-4 pb-10 sm:px-6 sm:pb-12">
          <nav className="mb-6 text-xs text-white/70">
            <Link href={`/${lang}/`} className="link-gold text-white/85 hover:text-gold-300">{SITE.name}</Link>
            <span className="mx-2">›</span>
            <Link href={`/${lang}/c/${place.niche}/`} className="link-gold text-white/85 hover:text-gold-300">{cat}</Link>
            <span className="mx-2">›</span>
            <span className="text-white/70">{place.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300/90">
            <span className="trust-mark text-gold-200" style={{ background: "rgb(212 175 55 / 0.15)", borderColor: "rgb(212 175 55 / 0.4)" }}>
              ✓ Verified
            </span>
            <span className="text-white/60">·</span>
            <span>{cat}</span>
            {place.city && (<><span className="text-white/60">·</span><span>{place.city}</span></>)}
            {place.is_halal_signaled && (<><span className="text-white/60">·</span><span className="text-gold-300">Halal signals detected</span></>)}
          </div>

          <h1 className="h-display mt-3 max-w-4xl text-4xl text-white sm:text-6xl">
            {place.name}
          </h1>

          {place.rating != null && (
            <div className="mt-4 flex items-baseline gap-4 text-white">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums text-gold-300">★ {place.rating.toFixed(1)}</span>
                {place.review_count ? (
                  <span className="text-sm text-white/70">({place.review_count.toLocaleString()} reviews)</span>
                ) : null}
              </div>
              {place.price_band !== "unknown" && (
                <span className="text-sm text-white/70">
                  {place.price_band === "budget" ? "฿" : place.price_band === "mid" ? "฿฿" : place.price_band === "premium" ? "฿฿฿" : "฿฿฿฿"}
                  {" "}{place.price_band}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========== EDITORIAL ARTICLE BODY ========== */}
      <main className="mx-auto max-w-5xl px-4 pb-28 sm:px-6 md:pb-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:gap-12">
          {/* ========== LEFT COLUMN — Article ========== */}
          <article className="min-w-0 pt-10">
            {/* Lead — either a real review quote or a short fact line */}
            {introHead ? (
              <div>
                <blockquote className="font-display text-xl italic leading-relaxed text-ink-900 dark:text-ink-100 sm:text-2xl">
                  {introHead}
                </blockquote>
                <div className="mt-3 text-xs uppercase tracking-wider text-gold-700 dark:text-gold-400">
                  — {reviewAuthor}, top review
                </div>
                <p className="mt-5 text-sm leading-relaxed muted">{introFacts}.</p>
              </div>
            ) : (
              <p className="text-base leading-relaxed text-ink-800 dark:text-ink-200">
                <span className="font-display text-2xl font-bold text-islam-900 dark:text-islam-100">{place.name}</span>
                <span className="ml-2 muted">· {introFacts}.</span>
              </p>
            )}

            {/* Suspected viral warning */}
            {place.is_suspected_viral && (
              <div className="mt-6 rounded-xl border-l-4 border-orange-500 bg-orange-50 px-4 py-3 text-sm text-orange-900 dark:bg-orange-950/30 dark:text-orange-200">
                <strong>⚠ Low signal:</strong> {t("low_signal_warn", lang)}
              </div>
            )}

            <div className="hr-editorial" />

            {/* SOURCES BREAKDOWN */}
            <section>
              <div className="eyebrow mb-2">Where the score comes from</div>
              <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">Cross-checked across {sources.length} sources</h2>
              <p className="mt-2 text-sm muted">
                The Trust Score combines independent signals. Each source contributes — paid promotion cannot change the rank.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {sources.map((s) => (
                  <div key={s.name} className="card-editorial p-4">
                    <div className="text-xs uppercase tracking-wider muted">{s.name}</div>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span aria-hidden="true">{s.icon}</span>
                      <span className="font-display text-2xl font-bold text-islam-900 dark:text-islam-100">{s.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* TOP REVIEW */}
            {place.top_review_text && (
              <>
                <div className="hr-editorial" />
                <section>
                  <div className="eyebrow mb-2">What people actually said</div>
                  <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">Top voice</h2>
                  <blockquote className="mt-5 border-l-4 border-gold-500 pl-5 sm:pl-7">
                    <p className="font-display text-xl italic leading-relaxed text-ink-800 dark:text-ink-100 sm:text-2xl">
                      "{place.top_review_text}"
                    </p>
                  </blockquote>
                  {place.reviews_sample.length > 1 && (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {place.reviews_sample.slice(1, 5).map((rv, i) => (
                        <div key={i} className="card-editorial p-4">
                          <div className="text-xs muted">
                            <span className="font-semibold">{rv.reviewer || "Anonymous"}</span>
                            {rv.rating ? <span className="ml-1 text-gold-600">· ★ {rv.rating}</span> : null}
                            {rv.date ? <span className="ml-1">· {rv.date}</span> : null}
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300">{rv.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* PHOTOS */}
            {place.photos_sample.length > 0 && (
              <>
                <div className="hr-editorial" />
                <section>
                  <div className="eyebrow mb-2">{t("photos_label", lang)}</div>
                  <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">
                    Gallery <span className="text-base font-normal muted">({place.photos_count})</span>
                  </h2>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {place.photos_sample.slice(0, 6).map((url, i) => (
                      <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl bg-ink-50 ring-1 ring-ink-100 dark:bg-ink-800 dark:ring-ink-800">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="h-full w-full object-cover transition duration-300 hover:scale-105" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* HOURS */}
            {hours && (
              <>
                <div className="hr-editorial" />
                <section>
                  <div className="eyebrow mb-2">{t("hours", lang)}</div>
                  <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">When to visit</h2>
                  <dl className="mt-4 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
                    {Object.entries(hours).map(([day, val]) => (
                      <div key={day} className="flex items-center justify-between rounded-lg border border-ink-100 bg-white px-4 py-2.5 dark:border-ink-800 dark:bg-ink-900">
                        <dt className="font-medium text-ink-800 dark:text-ink-200">{day}</dt>
                        <dd className="font-mono text-xs tabular-nums text-gold-700 dark:text-gold-400">{val}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </>
            )}

            {/* COMMUNITY MENTIONS — strict relevance filter */}
            {(() => {
              if (!place.community_mentions || place.community_mentions.length === 0) return null;

              // Reject obvious unrelated noise (movies, world news cyanide stories,
              // general saudi politics) by demanding either:
              //   (a) the place's own name (or a distinctive token from it) shows
              //       up in the thread title/snippet, OR
              //   (b) the thread is on a clearly relevant subreddit AND mentions
              //       a muslim-travel keyword.
              //
              // Drops box-office threads, generic crime news, etc. that previously
              // leaked in just because the keyword "Bangkok" or "Thailand" matched.
              const relevantSubs = new Set([
                "muslimtravels", "muslim", "islam", "saudiarabia", "uae", "dubai",
                "qatar", "kuwait", "oman", "bahrain", "malaysia", "indonesia",
                "brunei", "bangkok", "thailand", "thailandtourism", "phuket",
                "chiangmai", "krabi", "pattani", "yala", "halal", "learnarabic",
              ]);
              const halalKeywords = /\b(halal|muslim|hijab|qibla|prayer|wudu|mosque|masjid|iftar|ramadan|nikah|jum'?ah|cicot|crescent|muslim[\s-]*friendly|salat|imam|abaya|salaam|salam|salwa|jum'?aa|sahur|suhoor|tarawih|kabsa|mandi|shawarma|kebab|biryani|tandoori|gelatin[\s-]*free|alcohol[\s-]*free)/i;
              const noiseKeywords = /\b(box\s*office|cyanide|standoff|airport[\s-]*hotel\s*standoff|cocaine|murder|dead|cartoon|movie|trailer|stock\s*market)\b/i;

              const placeTokens = place.name
                .replace(/^(The|Al|El|La|Le)\s+/i, "")
                .split(/[\s\-_'.]+/)
                .filter((tok) => tok.length >= 4);

              const filtered = place.community_mentions.filter((m) => {
                const hay = `${m.title || ""} ${m.snippet || ""}`;
                if (noiseKeywords.test(hay)) return false;
                // Require either explicit place-name match OR (relevant sub + halal keyword)
                const nameMatch = placeTokens.some((tok) =>
                  hay.toLowerCase().includes(tok.toLowerCase())
                );
                const subOk = m.kind !== "reddit" || (m.subreddit && relevantSubs.has(m.subreddit.toLowerCase()));
                const keywordOk = halalKeywords.test(hay);
                return nameMatch || (subOk && keywordOk);
              });

              if (filtered.length === 0) return null;

              return (
                <>
                  <div className="hr-editorial" />
                  <section>
                    <div className="eyebrow mb-2">Independent voices</div>
                    <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">{t("mentions_in_community", lang)}</h2>
                    <p className="mt-2 text-sm muted">{t("mentions_blurb", lang)}</p>
                    <ul className="mt-5 space-y-3">
                      {filtered.map((m, i) => {
                        const sourceLabel = m.kind === "reddit" ? `r/${m.subreddit || "all"}` : m.kind === "pantip" ? "Pantip" : "Naver Blog";
                        const icon = m.kind === "reddit" ? "💬" : m.kind === "pantip" ? "🇹🇭" : "🇰🇷";
                        return (
                          <li key={i}>
                            <a href={m.url} target="_blank" rel="nofollow noopener" className="card-editorial block p-4">
                              <div className="flex items-center gap-2 text-xs muted">
                                <span>{icon}</span>
                                <span className="font-semibold uppercase tracking-wider">{sourceLabel}</span>
                                {m.score ? <span>· {m.score}↑</span> : null}
                                {m.comments ? <span>· {m.comments} comments</span> : null}
                                {m.date ? <span>· {m.date}</span> : null}
                              </div>
                              <div className="mt-1.5 font-display text-base leading-snug text-islam-900 dark:text-islam-100">{m.title}</div>
                              {m.snippet && <div className="mt-1 line-clamp-2 text-sm text-ink-700 dark:text-ink-300">{m.snippet}</div>}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </>
              );
            })()}

            {/* SIMILAR PLACES */}
            {similarPlaces.length > 0 && (
              <>
                <div className="hr-editorial" />
                <section>
                  <div className="eyebrow mb-2">You may also like</div>
                  <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">
                    Similar {cat.toLowerCase()}{place.city ? ` in ${place.city}` : " in Thailand"}
                  </h2>
                  <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {similarPlaces.map((sp) => (
                      <li key={sp.id}>
                        <Link
                          href={`/${lang}/place/${sp.slug}/`}
                          className="card-editorial group flex items-center gap-3 overflow-hidden p-3"
                        >
                          {sp.top_photo_url ? (
                            <div className="aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-800">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={sp.top_photo_url} alt={sp.name} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-islam-50 to-gold-50 text-2xl dark:from-islam-950/40 dark:to-gold-950/30">
                              {meta.emoji}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-1 font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                              {sp.name}
                            </div>
                            <div className="mt-0.5 text-[11px] muted">
                              {sp.city && <>📍 {sp.city} · </>}
                              {sp.rating != null && <>★ {sp.rating.toFixed(1)} · </>}
                              Trust {sp.trust_score}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            {/* PRAYER TIMES — city-aware, AlAdhan API */}
            {place.city && (
              <>
                <div className="hr-editorial" />
                <section>
                  <div className="eyebrow mb-2">Today in {place.city}</div>
                  <h2 className="h-display mb-4 text-2xl text-islam-950 dark:text-islam-50">
                    Prayer times for your visit
                  </h2>
                  <PrayerTimes city={place.city} />
                </section>
              </>
            )}

            {/* WIKI CROSS-LINKS — guide to broader context */}
            {(() => {
              const cityEntry = place.city
                ? CITIES.find((c) =>
                    c.matchCities.some((m) => m.toLowerCase() === place.city.toLowerCase())
                  )
                : null;
              return (
                <>
                  <div className="hr-editorial" />
                  <section>
                    <div className="eyebrow mb-2">Read the guide</div>
                    <h2 className="h-display mb-4 text-2xl text-islam-950 dark:text-islam-50">
                      Wiki context for this place
                    </h2>
                    <p className="mb-4 text-sm muted">
                      Background and orientation that goes beyond the directory listing — niche
                      guide, city handbook, and related encyclopedia entries.
                    </p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      <li>
                        <Link
                          href={`/${lang}/wiki/niche/${place.niche}/`}
                          className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-islam-50 to-gold-50 text-xl dark:from-islam-950/40 dark:to-gold-950/30">
                            {meta.emoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
                              Niche guide
                            </div>
                            <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                              {cat} in Thailand
                            </div>
                          </div>
                          <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                        </Link>
                      </li>
                      {cityEntry && (
                        <li>
                          <Link
                            href={`/${lang}/wiki/city/${cityEntry.slug}/`}
                            className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                          >
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 text-xl dark:from-rose-950/30 dark:to-amber-950/30">
                              {cityEntry.emoji}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
                                City guide
                              </div>
                              <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                                Muslim travel in {cityEntry.name}
                              </div>
                            </div>
                            <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          href={`/${lang}/wiki/topic/cicot-certification/`}
                          className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-50 to-yellow-50 text-xl dark:from-emerald-950/30 dark:to-yellow-950/30">
                            ✅
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
                              Topic
                            </div>
                            <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                              CICOT halal certification
                            </div>
                          </div>
                          <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={`/${lang}/wiki/topic/halal-vs-muslim-friendly/`}
                          className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 text-xl dark:from-pink-950/30 dark:to-rose-950/30">
                            🔍
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
                              Topic
                            </div>
                            <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                              Halal vs. muslim-friendly
                            </div>
                          </div>
                          <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    </ul>
                  </section>
                </>
              );
            })()}

            <div className="hr-editorial" />
            <Link href={`/${lang}/c/${place.niche}/`} className="link-gold inline-block text-sm font-medium text-islam-700 dark:text-islam-300">
              ← Back to {cat}
            </Link>
          </article>

          {/* ========== RIGHT COLUMN — Sticky aside ========== */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:pt-10">
            <div className="card-editorial p-6">
              {/* Trust Score — circular gauge */}
              <div className="flex flex-col items-center border-b border-ink-100 pb-5 dark:border-ink-800">
                <div className="eyebrow mb-3 self-start">{t("trust_score", lang)}</div>
                <TrustGauge score={place.trust_score} size={140} />
                <div className="mt-3 text-[11px] muted">
                  Cross-checked across {sources.length} sources
                </div>
              </div>

              {/* Source pills */}
              {sources.length > 0 && (
                <div className="border-b border-ink-100 py-4 dark:border-ink-800">
                  <div className="eyebrow mb-2">Verified across</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sources.map((s) => (
                      <span key={s.name} className="inline-flex items-center gap-1 rounded-full bg-islam-50 px-2 py-0.5 text-[10px] font-medium text-islam-700 dark:bg-islam-950/50 dark:text-islam-300">
                        <span aria-hidden="true">{s.icon}</span>
                        <span>{s.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key info */}
              <dl className="grid grid-cols-2 gap-x-3 gap-y-3 border-b border-ink-100 py-4 text-xs dark:border-ink-800">
                {place.rating != null && (
                  <div>
                    <dt className="eyebrow !text-[10px]">Google</dt>
                    <dd className="mt-0.5 font-bold tabular-nums text-gold-700 dark:text-gold-400">★ {place.rating.toFixed(1)}</dd>
                  </div>
                )}
                {place.review_count != null && (
                  <div>
                    <dt className="eyebrow !text-[10px]">Reviews</dt>
                    <dd className="mt-0.5 font-bold tabular-nums">{place.review_count.toLocaleString()}</dd>
                  </div>
                )}
                {place.photos_count > 0 && (
                  <div>
                    <dt className="eyebrow !text-[10px]">Photos</dt>
                    <dd className="mt-0.5 font-bold tabular-nums">{place.photos_count}</dd>
                  </div>
                )}
                {place.videos_count > 0 && (
                  <div>
                    <dt className="eyebrow !text-[10px]">Videos</dt>
                    <dd className="mt-0.5 font-bold tabular-nums">{place.videos_count}</dd>
                  </div>
                )}
                {place.price_band !== "unknown" && (
                  <div className="col-span-2">
                    <dt className="eyebrow !text-[10px]">{t("price_range", lang)}</dt>
                    <dd className="mt-0.5 font-bold">
                      {place.price_min_thb > 0 ? `฿${place.price_min_thb.toLocaleString()}` : "—"}
                      {place.price_max_thb > place.price_min_thb ? ` – ฿${place.price_max_thb.toLocaleString()}` : ""}
                      <span className="ml-1 text-[10px] font-normal muted">/ {place.price_unit}</span>
                    </dd>
                  </div>
                )}
              </dl>

              {/* Feature tags */}
              <div className="border-b border-ink-100 py-4 dark:border-ink-800">
                <div className="flex flex-wrap gap-1.5">
                  {place.is_halal_signaled && (
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold text-gold-800 dark:bg-gold-950/50 dark:text-gold-300">
                      ☪ Halal signal
                    </span>
                  )}
                  {place.is_beginner_friendly && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                      🐣 Beginner
                    </span>
                  )}
                  {place.languages.ko && (
                    <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                      🇰🇷 KO
                    </span>
                  )}
                  {place.languages.ar && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      🇸🇦 AR
                    </span>
                  )}
                  {place.languages.zh && (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                      🇨🇳 ZH
                    </span>
                  )}
                  {place.languages.ja && (
                    <span className="rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-medium text-pink-700 dark:bg-pink-900/40 dark:text-pink-300">
                      🇯🇵 JA
                    </span>
                  )}
                  {place.is_open_24h && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      🌙 24h
                    </span>
                  )}
                </div>
              </div>

              {/* DIRECT booking (Salaam Thailand) */}
              <div className="border-b border-ink-100 py-4 dark:border-ink-800">
                <div className="eyebrow mb-3">Book directly · no markup</div>
                <BookingForm
                  placeId={place.slug}
                  placeName={place.name}
                  placeNiche={place.niche}
                  placeCity={place.city || ""}
                  placePhone={place.phone || undefined}
                  placeWebsite={place.website || undefined}
                  placeMapsUrl={place.google_maps_url || undefined}
                  triggerLabel={
                    place.niche === "halal-food" ? "Reserve a table" :
                    place.niche === "muslim-hotel" ? "Inquire about rooms" :
                    place.niche === "halal-tour" ? "Book this tour" :
                    place.niche === "halal-clinic" ? "Request consultation" :
                    place.niche === "halal-beauty" ? "Book appointment" :
                    "Send booking request"
                  }
                />
                <p className="mt-2 text-[10px] leading-relaxed muted">
                  Goes directly to the venue (and to our operations inbox as a backup). No booking fee, no commission to a middle-man.
                </p>
              </div>

              {/* AFFILIATE — secondary path for users who prefer one of the big platforms */}
              {hasAffiliate && (
                <div className="border-b border-ink-100 py-4 dark:border-ink-800">
                  <div className="eyebrow mb-3">Or book via partner</div>
                  <AffiliateCTA place={place} lang={lang} />
                  <p className="mt-2 text-[10px] leading-relaxed muted">
                    {t("affiliate_disclaimer", lang)}
                  </p>
                </div>
              )}

              {/* Contact */}
              <div className="pt-4 text-xs">
                <div className="eyebrow mb-2">{t("contact_links", lang)}</div>
                <ul className="space-y-2">
                  {place.address && (
                    <li className="text-ink-700 dark:text-ink-300">📍 {place.address}</li>
                  )}
                  {place.phone && (
                    <li>
                      <a href={`tel:${place.phone}`} className="link-gold text-islam-700 dark:text-islam-300">
                        📞 {place.phone}
                      </a>
                    </li>
                  )}
                  {place.website && (
                    <li>
                      <a href={place.website} target="_blank" rel="noopener" className="link-gold truncate text-islam-700 dark:text-islam-300">
                        🔗 Website
                      </a>
                    </li>
                  )}
                  {place.google_maps_url && (
                    <li>
                      <a href={place.google_maps_url} target="_blank" rel="noopener" className="link-gold text-islam-700 dark:text-islam-300">
                        🗺 {t("cta_view_map", lang)}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <StickyBookBar place={place} lang={lang} />
    </>
  );
}
