// Wiki index — the table-of-contents page. Lists every wiki article we have:
// niche entries, city guides, topic encyclopedia. Acts as both a landing page
// and a sitemap hub for Googlebot.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";
import { CITIES, TOPICS } from "@/lib/wiki-registry";

export const dynamic = "force-static";
export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: `Wiki — ${SITE.name}`,
  description: "Encyclopedia of halal and muslim-friendly Thailand — niche guides, city handbooks, and topic deep-dives. Independently verified across 8 sources.",
};

const NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

export default function WikiIndexPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-20 sm:px-10">
          <div className="eyebrow mb-2 text-gold-300/90">Independent encyclopedia</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl">
            The Salaam Thailand <span className="text-gradient-gold italic">Wiki</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Long-form, cross-verified articles on every aspect of halal and muslim-friendly
            travel in Thailand. No paid placement, no AI hallucinations — each entry cites
            the same 8 independent sources we use for our directory.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {/* NICHE GUIDES */}
        <section className="mt-14">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <div className="eyebrow mb-1">Niche guides</div>
              <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">
                By category
              </h2>
            </div>
            <span className="text-xs muted">{NICHES.length} entries</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NICHES.map((n) => (
              <li key={n}>
                <Link
                  href={`/${lang}/wiki/niche/${n}/`}
                  className="card-editorial group flex items-center gap-3 p-4 transition hover:border-gold-400"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-islam-50 to-gold-50 text-xl dark:from-islam-950/40 dark:to-gold-950/30">
                    {NICHE_META[n].emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                      {nicheName(n, lang)}
                    </div>
                    <div className="text-[11px] muted">in Thailand</div>
                  </div>
                  <span className="text-gold-700 transition group-hover:translate-x-1 dark:text-gold-400" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* CITY GUIDES */}
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <div className="eyebrow mb-1">City guides</div>
              <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">
                By destination
              </h2>
            </div>
            <span className="text-xs muted">{CITIES.length} entries</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/${lang}/wiki/city/${c.slug}/`}
                  className="card-editorial group flex items-start gap-3 p-4 transition hover:border-gold-400"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-islam-50 to-gold-50 text-xl dark:from-islam-950/40 dark:to-gold-950/30">
                    {c.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                      Muslim travel in {c.name}
                    </div>
                    <div className="line-clamp-1 text-[11px] muted">{c.hint}</div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* TOPIC ENCYCLOPEDIA */}
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <div className="eyebrow mb-1">Topic encyclopedia</div>
              <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">
                By subject
              </h2>
            </div>
            <span className="text-xs muted">{TOPICS.length} entries</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${lang}/wiki/topic/${t.slug}/`}
                  className="card-editorial group flex items-start gap-3 p-4 transition hover:border-gold-400"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 text-xl dark:from-rose-950/30 dark:to-amber-950/30">
                    {t.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm font-bold text-islam-950 dark:text-islam-50">
                      {t.title}
                    </div>
                    <div className="line-clamp-1 text-[11px] muted">{t.hint}</div>
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
