// Wiki index — the table-of-contents page. Lists every wiki article we have:
// niche entries, city guides, topic encyclopedia. Acts as both a landing page
// and a sitemap hub for Googlebot.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";

// Inlined from lib/wiki-registry to sidestep Vercel's stricter Next 14 page
// type validator that misreports the named import as an invalid Page export
// field. Keep these in sync with lib/wiki-registry.ts (source of truth for
// the dynamic city/topic routes).
const CITIES = [
  { slug: "bangkok",       name: "Bangkok",       emoji: "🏙",  hint: "Soi Arab · Indra Square · Phra Khanong" },
  { slug: "phuket",        name: "Phuket",        emoji: "🏖",  hint: "Halal beaches & Old Town" },
  { slug: "krabi",         name: "Krabi",         emoji: "🚤",  hint: "Muslim community + Andaman halal seafood" },
  { slug: "chiang-mai",    name: "Chiang Mai",    emoji: "🏔",  hint: "Halal khao soi + Old City mosques" },
  { slug: "hat-yai",       name: "Hat Yai",       emoji: "🚉",  hint: "Southern hub — Malaysia border" },
  { slug: "pattaya",       name: "Pattaya",       emoji: "🏄",  hint: "GCC traveler favorite" },
  { slug: "hua-hin",       name: "Hua Hin",       emoji: "⛱",  hint: "Royal beach town" },
  { slug: "koh-samui",     name: "Koh Samui",     emoji: "🌴",  hint: "Island resorts" },
  { slug: "ko-lanta",      name: "Ko Lanta",      emoji: "🏝",  hint: "Muslim-majority island" },
  { slug: "pattani",       name: "Pattani",       emoji: "🕌",  hint: "Cultural heart of Thai Muslims" },
];
const TOPICS = [
  { slug: "cicot-certification",            title: "CICOT halal certification",          emoji: "✅", hint: "How Thailand's official halal label works" },
  { slug: "ramadan-in-thailand",            title: "Ramadan in Thailand",                emoji: "🌙", hint: "What changes during the holy month" },
  { slug: "iftar-buffets-bangkok",          title: "Iftar buffets in Bangkok",           emoji: "🍽", hint: "Top hotel & restaurant iftar tables" },
  { slug: "prayer-rooms-thai-airports",     title: "Prayer rooms at Thai airports",      emoji: "🛫", hint: "Suvarnabhumi · Don Mueang · Phuket · Krabi" },
  { slug: "muslim-travel-etiquette",        title: "Muslim travel etiquette in Thailand", emoji: "🤝", hint: "What to expect, what to ask, what to bring" },
  { slug: "halal-vs-muslim-friendly",       title: "Halal vs. muslim-friendly",          emoji: "🔍", hint: "The label difference explained" },
  { slug: "halal-tourism-statistics",       title: "Halal tourism statistics",           emoji: "📊", hint: "8M+ muslim arrivals annually" },
  { slug: "qibla-direction-thailand",       title: "Qibla direction in Thailand",        emoji: "🧭", hint: "Roughly west-northwest from anywhere in TH" },
  { slug: "jumah-prayer-bangkok-mosques",   title: "Jum'ah prayer at Bangkok mosques",   emoji: "🕌", hint: "Schedule, which mosques, parking" },
  { slug: "halal-meat-suppliers-thailand",  title: "Halal meat suppliers in Thailand",   emoji: "🥩", hint: "Wholesale, retail, certifications" },
  { slug: "muslim-population-thailand",     title: "Muslim population in Thailand",      emoji: "📌", hint: "Geography & community" },
  { slug: "alcohol-free-thai-drinks",       title: "Alcohol-free Thai drinks guide",     emoji: "🥥", hint: "What to order at a Thai bar/cafe" },
  { slug: "wudu-facilities-bangkok",        title: "Wudu facilities in Bangkok",         emoji: "💧", hint: "Where to perform ablution in public" },
  { slug: "family-friendly-halal-hotels-phuket", title: "Family-friendly halal hotels in Phuket", emoji: "👨‍👩‍👧", hint: "Beach access + halal kitchen + prayer kit" },
  { slug: "southern-thailand-muslim-history",    title: "Southern Thailand muslim history",       emoji: "📜", hint: "Pattani · Yala · Narathiwat" },
  { slug: "zamzam-water-availability-bangkok",   title: "Zamzam water in Bangkok",                emoji: "🚰", hint: "Where to find it" },
  { slug: "arabic-language-thailand",       title: "Arabic language in Thailand",        emoji: "🇸🇦", hint: "Speakers, classes, signage" },
  { slug: "halal-medical-tourism",          title: "Halal medical tourism",              emoji: "🏥", hint: "Female doctors, halal hospital diets" },
  { slug: "muslim-wedding-customs-thailand", title: "Muslim wedding customs in Thailand", emoji: "💍", hint: "Nikah, walima, halal catering" },
  { slug: "turkish-restaurant-history-bangkok", title: "Turkish restaurant scene in Bangkok", emoji: "🥙", hint: "How Bangkok became a kebab capital" },
];

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
