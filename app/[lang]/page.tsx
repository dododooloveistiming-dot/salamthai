import type { Metadata } from "next";
import Link from "next/link";
import { loadPlaces, getTopPlacesPerNiche } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, T, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";

export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: { lang: Lang } }): Promise<Metadata> {
  const { lang } = params;
  const url = `${SITE.origin}/${lang}/`;
  return {
    title: `${SITE.name} — ${t("hero_title", lang)}`,
    description: SITE.tagline[lang],
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/`])),
    },
    openGraph: {
      title: `${SITE.name}`,
      description: SITE.tagline[lang],
      url,
      images: [{ url: `${SITE.origin}/og-default.png`, width: 1200, height: 630 }],
    },
  };
}

export default function LandingPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const bundle = loadPlaces();
  const topPerNiche = getTopPlacesPerNiche(3);

  const niches: Niche[] = [
    "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-20">
      {/* HERO — Islamic-themed: deep emerald + gold + 8-pointed star pattern */}
        <section className="relative mt-6 overflow-hidden rounded-3xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 px-6 py-16 dark:border-islam-800/60 dark:from-islam-950/60 dark:via-ink-900 dark:to-gold-950/40 sm:px-12">
          {/* Islamic 8-pointed-star pattern overlay */}
          <div className="bg-islamic-stars absolute inset-0 opacity-60" aria-hidden="true" />
          {/* Soft color blobs */}
          <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-islam-300/50 blur-3xl dark:bg-islam-700/30" aria-hidden="true" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-gold-300/40 blur-3xl dark:bg-gold-700/30" aria-hidden="true" />

          <div className="relative">
            {/* Arabic greeting — top-of-fold, calligraphic */}
            <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span
                className="font-arabic text-2xl font-medium text-islam-700 dark:text-islam-300 sm:text-3xl"
                dir="rtl"
                lang="ar"
              >
                {t("greeting_arabic", lang)}
              </span>
              {t("greeting_translit", lang) && (
                <span className="text-xs font-medium text-islam-700/80 dark:text-islam-400">
                  {t("greeting_translit", lang)}
                </span>
              )}
              <span className="text-xs muted">· {t("greeting_meaning", lang)}</span>
            </div>

            {/* Verified stat pill */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-islam-300 bg-white/80 px-3 py-1 text-xs font-semibold text-islam-800 dark:border-islam-700 dark:bg-islam-950/40 dark:text-islam-300">
              <span className="h-1.5 w-1.5 rounded-full bg-islam-500" />
              {bundle.total.toLocaleString()} verified places · avg Trust Score {bundle.avg_trust}
            </div>

            {/* Title — Salaam in gold, rest in deep emerald */}
            <h1 className="text-4xl font-black tracking-tight text-islam-950 dark:text-islam-50 sm:text-6xl">
              <span className="text-gradient-gold">Salaam</span>{" "}
              <span>Thailand.</span>
              <br />
              <span className="text-3xl sm:text-5xl">{t("hero_title", lang).replace(/^Salaam Thailand\.\s*/i, "").replace(/^[^.]+\.\s*/, "")}</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium text-ink-800 dark:text-ink-200 sm:text-lg">
              {t("hero_subtitle", lang)}
            </p>
            <p className="mt-3 text-xs text-islam-800/70 dark:text-islam-400/80">
              {t("sources_pitch", lang)}
            </p>

            {/* Category quick links — gold-accent pills */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {niches.map((n) => (
                <Link
                  key={n}
                  href={`/${lang}/c/${n}/`}
                  className="inline-flex items-center gap-2 rounded-full border border-islam-300/70 bg-white/90 px-4 py-2 text-sm font-semibold text-islam-900 backdrop-blur transition hover:-translate-y-0.5 hover:border-gold-400 hover:bg-gold-50 hover:shadow-md dark:border-islam-700/60 dark:bg-ink-900/80 dark:text-islam-100 dark:hover:border-gold-600 dark:hover:bg-gold-950/40"
                >
                  <span className="text-base">{NICHE_META[n].emoji}</span>
                  <span>{nicheName(n, lang)}</span>
                  <span className="rounded-full bg-islam-100 px-1.5 text-xs font-bold text-islam-700 dark:bg-islam-900/60 dark:text-islam-300">
                    {(bundle.by_niche as any)[n] ?? 0}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* POPULAR PICKS — quick deep-link strip */}
        <section className="mt-8">
          <div className="text-xs uppercase tracking-wide font-bold muted mb-3">
            {t("popular_picks", lang)}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Bangkok halal restaurant", href: `/${lang}/c/halal-food/?city=bangkok` },
              { label: "Phuket muslim hotel", href: `/${lang}/c/muslim-hotel/?city=phuket` },
              { label: "Krabi halal tour", href: `/${lang}/c/halal-tour/?city=krabi` },
              { label: "Bangkok mosque", href: `/${lang}/c/mosque/?city=bangkok` },
              { label: "Bumrungrad muslim friendly", href: `/${lang}/c/halal-clinic/?city=bangkok` },
              { label: "Halal cosmetics", href: `/${lang}/c/halal-beauty/` },
              { label: "Chiang Mai halal", href: `/${lang}/c/halal-food/?city=chiang-mai` },
            ].map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="rounded-full bg-ink-100 px-3 py-1.5 text-xs font-medium text-ink-700 transition hover:bg-emerald-100 hover:text-emerald-800 dark:bg-ink-800 dark:text-ink-300 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
              >
                {p.label} →
              </Link>
            ))}
          </div>
        </section>

        {/* CATEGORY GRID */}
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight">{t("browse_categories", lang)}</h2>
            <span className="text-xs muted">{bundle.total.toLocaleString()} {t("places_count", lang)}</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {niches.map((n) => {
              const meta = NICHE_META[n];
              const count = (bundle.by_niche as any)[n] ?? 0;
              const isReady = count > 0;
              const topThree = topPerNiche[n] ?? [];
              return (
                <Link
                  key={n}
                  href={`/${lang}/c/${n}/`}
                  className={`group relative flex flex-col gap-3 rounded-2xl border bg-white p-5 transition dark:bg-ink-900 ${
                    isReady
                      ? "border-ink-100 hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-lg dark:border-ink-800"
                      : "border-dashed border-ink-200 opacity-70 dark:border-ink-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl">{meta.emoji}</div>
                      <h3 className="mt-2 text-lg font-bold">{nicheName(n, lang)}</h3>
                      <p className="mt-1 text-sm muted">{nicheTagline(n, lang)}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black tabular-nums">{count.toLocaleString()}</div>
                      <div className="text-[10px] muted uppercase">{isReady ? t("places_count", lang) : t("coming_soon", lang)}</div>
                    </div>
                  </div>
                  {topThree.length > 0 && (
                    <div className="mt-2 space-y-1 border-t border-ink-100 pt-2 text-xs dark:border-ink-800">
                      <div className="muted">{t("top_picks", lang)}:</div>
                      {topThree.map((p) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <span className="truncate">{p.name}</span>
                          <span className="ml-2 shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            {p.trust_score}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>

        {/* MULTI-SOURCE PITCH */}
        <section className="mt-16 rounded-2xl border border-ink-100 bg-white p-8 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="text-xl font-bold">{t("score_pitch_title", lang)}</h2>
          <p className="mt-2 text-sm muted">{t("score_pitch_blurb", lang)}</p>
          {(() => {
            const cards = [
              { name: "Google", count: bundle.places.filter((p) => p.source_badges.google_reviews > 0).length, badge: "★" },
              { name: "Reddit", count: bundle.places.filter((p) => p.source_badges.reddit > 0).length, badge: "💬" },
              { name: "YouTube", count: bundle.places.filter((p) => p.source_badges.videos > 0).length, badge: "▶" },
              { name: "Naver", count: bundle.places.filter((p) => p.source_badges.naver > 0).length, badge: "🇰🇷" },
              { name: "Pantip", count: bundle.places.filter((p) => p.source_badges.pantip > 0).length, badge: "🇹🇭" },
              { name: "Bookimed", count: bundle.places.filter((p) => p.source_badges.bookimed > 0).length, badge: "🏥" },
              { name: "Photos", count: bundle.places.filter((p) => p.source_badges.photos > 0).length, badge: "📸" },
              { name: "Official sites", count: bundle.places.filter((p) => p.source_badges.website > 0).length, badge: "🔗" },
            ].filter((s) => s.count > 0);
            return (
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {cards.map((s) => (
                  <div key={s.name} className="rounded-xl bg-emerald-50/60 p-3 text-sm dark:bg-emerald-950/30">
                    <div className="text-xl">{s.badge}</div>
                    <div className="mt-1 font-bold">{s.name}</div>
                    <div className="text-xs muted">{s.count.toLocaleString()} places</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </section>

    </main>
  );
}
