import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPlaces, getPlacesByNiche, loadCommunity } from "@/lib/data";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName, nicheTagline } from "@/lib/types";
import { NICHE_GUIDES, ll } from "@/lib/niche-content";
import CategoryClient from "@/components/CategoryClient";

const NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

export const dynamic = "force-static";

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
  const guide = NICHE_GUIDES[niche];
  const description = ll(guide.intro, lang).slice(0, 200);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/c/${niche}/`])),
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
  const guide = NICHE_GUIDES[niche];

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
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((f) => ({
        "@type": "Question",
        name: ll(f.q, lang),
        acceptedAnswer: { "@type": "Answer", text: ll(f.a, lang) },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${nicheName(niche, lang)} in Thailand — Verified Guide`,
      datePublished: "2026-05-25",
      dateModified: new Date().toISOString().slice(0, 10),
      author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      mainEntityOfPage: `${SITE.origin}/${lang}/c/${niche}/`,
      description: ll(guide.intro, lang).slice(0, 250),
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
              {ll(guide.intro, lang)}
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

        {/* TOP PICKS — actual data list */}
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-islam-900 dark:text-islam-100">
            <span className="mr-2 font-arabic text-islam-600 dark:text-islam-400" dir="rtl" lang="ar">٢</span>
            Verified places
          </h2>
          {places.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-islam-300 bg-islam-50/50 p-8 text-center dark:border-islam-700 dark:bg-islam-950/30">
              <div className="text-3xl">{meta.emoji}</div>
              <p className="mt-2 text-base font-bold text-islam-900 dark:text-islam-100">{t("coming_soon", lang)}</p>
              <p className="mt-1 text-sm muted">{t("coming_soon_msg", lang)}</p>
            </div>
          ) : (
            <CategoryClient places={places} lang={lang} niche={niche} />
          )}
        </section>

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
