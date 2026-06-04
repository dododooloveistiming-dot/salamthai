import type { Metadata } from "next";
import Link from "next/link";
import { loadPlaces, getTopPlacesPerNiche } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";
import HeroSearch from "@/components/HeroSearch";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: { lang: Lang } }): Promise<Metadata> {
  const { lang } = params;
  const url = `${SITE.origin}/${lang}/`;
  return {
    title: `${SITE.name} — ${t("hero_title", lang)}`,
    description: SITE.tagline[lang],
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/`])),
        "x-default": `${SITE.origin}/en/`,
      },
    },
    openGraph: {
      title: `${SITE.name}`,
      description: SITE.tagline[lang],
      url,
      images: [{ url: `${SITE.origin}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

const ALL_NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

// Each popular query is tagged with the niche it routes to so we can hide
// queries whose niche has no data yet.
const POPULAR_QUERIES: Array<{ label: string; href: string; niche: Niche }> = [
  { label: "Halal restaurants Bangkok",   href: "/c/halal-food/?city=bangkok",    niche: "halal-food" },
  { label: "Muslim hotels Phuket",        href: "/c/muslim-hotel/?city=phuket",   niche: "muslim-hotel" },
  { label: "Iftar buffet near me",        href: "/c/halal-food/",                  niche: "halal-food" },
  { label: "Mosques in Bangkok",          href: "/c/mosque/?city=bangkok",        niche: "mosque" },
  { label: "CICOT-certified clinic",      href: "/c/halal-clinic/",                niche: "halal-clinic" },
  { label: "Halal cosmetics Bangkok",     href: "/c/halal-beauty/",                niche: "halal-beauty" },
];

export default function LandingPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const bundle = loadPlaces();
  const topPerNiche = getTopPlacesPerNiche(4);
  // Only render niches that actually have data — empty "Coming soon" cards
  // dilute trust on first visit.
  const niches = ALL_NICHES.filter((n) => ((bundle.by_niche as any)[n] ?? 0) > 0);
  const popularQueries = POPULAR_QUERIES.filter((q) => ((bundle.by_niche as any)[q.niche] ?? 0) > 0);

  // JSON-LD: Organization + WebSite (with sitelinks search action)
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.origin,
      description: SITE.tagline.en,
      logo: `${SITE.origin}/og-default.png`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.origin,
      inLanguage: ["en", "ko", "th", "zh", "ja", "ar"],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ========== HERO — Vogue Arabia × Booking trust × Airbnb ========== */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        {/* Background photo — Sheikh Zayed Grand Mosque at golden hour */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1542295669297-4d352b042bca?w=2400&h=1400&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
          loading="eager"
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/80 to-emerald-950/85" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 -z-10 opacity-[0.10]" aria-hidden="true" />
        {/* Gold blob accents */}
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" aria-hidden="true" />

        {/* Decorative dome silhouettes — top edge */}
        <svg className="absolute inset-x-0 top-0 h-8 w-full text-gold-500/20" viewBox="0 0 1200 32" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 32 V20 Q60 0 120 20 Q180 0 240 20 Q300 0 360 20 Q420 0 480 20 Q540 0 600 20 Q660 0 720 20 Q780 0 840 20 Q900 0 960 20 Q1020 0 1080 20 Q1140 0 1200 20 V32 Z"/>
        </svg>

        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-10 sm:pb-32 sm:pt-28">
          {/* Top eyebrow trust strip */}
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.22em] text-gold-300/90">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Verified
            </span>
            <span>·</span>
            <span>Muslim-Friendly</span>
            <span>·</span>
            <span>No paid promotion</span>
            <span>·</span>
            <span>6 independent sources</span>
          </div>

          {/* Arabic ornament */}
          <div className="mb-6 flex items-baseline gap-3 text-gold-300">
            <span className="font-arabic text-3xl sm:text-4xl" dir="rtl" lang="ar">
              ٱلسَّلَامُ عَلَيْكُمْ
            </span>
            <span className="text-xs font-medium tracking-wide text-gold-300/70">
              Assalāmu ʿAlaykum
            </span>
          </div>

          {/* Display headline — Playfair serif. Tuned for mobile readability. */}
          <h1 className="h-display max-w-4xl text-[2.5rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Thailand&apos;s <span className="text-gradient-gold italic">verified</span><br />
            halal directory.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Restaurants. Hotels. Tours. Mosques. Clinics. Beauty.
            Cross-checked across Google, Reddit, Naver, Pantip, YouTube, and official sources —
            never paid placement.
          </p>

          {/* Search input — primary CTA with autocomplete */}
          <div className="mt-10">
            <HeroSearch lang={lang} />
          </div>

          {/* Popular queries */}
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            <span className="text-white/50">Popular:</span>
            {popularQueries.map((q) => (
              <Link
                key={q.label}
                href={`/${lang}${q.href}`}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-white/85 backdrop-blur transition hover:border-gold-400/60 hover:bg-gold-400/15 hover:text-gold-200"
              >
                {q.label}
              </Link>
            ))}
          </div>

          {/* Trust statline */}
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
            <div>
              <div className="font-display text-3xl font-bold text-white">{bundle.total.toLocaleString()}+</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Verified places</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-white">6</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Source channels</div>
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-gold-300">0</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/60">Paid placements</div>
            </div>
          </div>
        </div>

        {/* Bottom edge — dome silhouette decoration */}
        <svg className="absolute inset-x-0 bottom-0 h-6 w-full text-bg" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true">
          <path fill="currentColor" d="M0 24 V12 Q60 0 120 12 Q180 0 240 12 Q300 0 360 12 Q420 0 480 12 Q540 0 600 12 Q660 0 720 12 Q780 0 840 12 Q900 0 960 12 Q1020 0 1080 12 Q1140 0 1200 12 V24 Z" />
        </svg>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        {/* ========== CATEGORIES — Editorial cards ========== */}
        <section className="mt-20">
          <div className="mb-10 flex flex-col items-baseline gap-2 sm:flex-row sm:justify-between">
            <div>
              <div className="eyebrow mb-2">Categories</div>
              <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
                Where will you start?
              </h2>
            </div>
            <span className="text-sm muted">{bundle.total.toLocaleString()} verified places · across {niches.length} categories</span>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {niches.map((n) => {
              const meta = NICHE_META[n];
              const count = (bundle.by_niche as any)[n] ?? 0;
              const isReady = count > 0;
              const topThree = topPerNiche[n] ?? [];
              return (
                <Link
                  key={n}
                  href={`/${lang}/c/${n}/`}
                  className="card-editorial group relative flex flex-col gap-4 p-7"
                >
                  {/* Gold corner mark */}
                  <span className="absolute right-5 top-5 text-base text-gold-500 opacity-0 transition group-hover:opacity-100" aria-hidden="true">→</span>

                  <div className="text-5xl">{meta.emoji}</div>

                  <div>
                    <h3 className="h-display text-2xl text-islam-950 dark:text-islam-50">
                      {nicheName(n, lang)}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed muted">{nicheTagline(n, lang)}</p>
                  </div>

                  <div className="mt-auto flex items-baseline justify-between border-t border-ink-100/70 pt-4 dark:border-ink-800">
                    <div>
                      <div className="font-display text-3xl font-bold tabular-nums text-islam-900 dark:text-islam-100">
                        {count.toLocaleString()}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider muted">
                        {isReady ? "verified places" : t("coming_soon", lang)}
                      </div>
                    </div>
                    {isReady && topThree.length > 0 && (
                      <div className="text-right text-[10px] uppercase tracking-wider text-gold-700 dark:text-gold-400">
                        Top picks ready
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== WHY TRUST US — 3-column pitch ========== */}
        <section className="mt-4">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-2">How it works</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              Independent. Cross-checked. Public formula.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed muted">
              Every place is scored on signals you can audit. No place can buy a higher rank — the formula is in the open.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-editorial p-7">
              <div className="mb-3 text-3xl">🔍</div>
              <h3 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                6 independent sources
              </h3>
              <p className="mt-2 text-sm leading-relaxed muted">
                Google · Reddit · Naver · Pantip · YouTube · Official websites. Each signal contributes independently to the Trust Score.
              </p>
            </div>

            <div className="card-editorial p-7">
              <div className="mb-3 text-3xl">🚫</div>
              <h3 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                No paid placement
              </h3>
              <p className="mt-2 text-sm leading-relaxed muted">
                Affiliate commissions support the site after the score is computed — never before. Featured listings are clearly labeled.
              </p>
            </div>

            <div className="card-editorial p-7">
              <div className="mb-3 text-3xl">🕌</div>
              <h3 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                Halal-first signals
              </h3>
              <p className="mt-2 text-sm leading-relaxed muted">
                CICOT mentions, prayer-room availability, qibla, and halal kitchen flags are text-mined across 8 languages and weighted toward muslim travelers.
              </p>
            </div>
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== POPULAR DEEP-LINK CARPET ========== */}
        <section className="mt-4">
          <div className="mb-6">
            <div className="eyebrow mb-2">Popular searches</div>
            <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">Where muslim travelers go next</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularQueries.concat([
              { label: "Bangkok mosque near hotel",    href: "/c/mosque/?city=bangkok",       niche: "mosque" as Niche },
              { label: "Phuket halal seafood",         href: "/c/halal-food/?city=phuket",    niche: "halal-food" as Niche },
              { label: "Bumrungrad muslim friendly",   href: "/c/halal-clinic/?city=bangkok", niche: "halal-clinic" as Niche },
              { label: "Krabi muslim resort",          href: "/c/muslim-hotel/?city=krabi",   niche: "muslim-hotel" as Niche },
            ]).filter((q) => ((bundle.by_niche as any)[q.niche] ?? 0) > 0).map((q) => (
              <Link
                key={q.label}
                href={`/${lang}${q.href}`}
                className="rounded-full border border-ink-200 bg-white px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-gold-400 hover:bg-gold-50 hover:text-gold-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
              >
                {q.label} →
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
