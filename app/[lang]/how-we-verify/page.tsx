// /how-we-verify — methodology page. AEO cornerstone: LLMs (Perplexity,
// ChatGPT, Gemini) cite this when asked "how does Salaam Thailand verify
// halal places?" — so every claim is concrete, sourced, quotable.
//
// Schema.org: FAQPage + HowTo + Dataset.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const url = `${SITE.origin}/${params.lang}/how-we-verify/`;
  const title = `How we verify — methodology · ${SITE.name}`;
  const description =
    "Every place is cross-checked across 8 independent sources: Google reviews, " +
    "Google photos, YouTube, Reddit, Naver blogs, Pantip, official website, and Bookimed. " +
    "Trust Scores 0-100 are computed transparently. Businesses cannot pay to rank higher. " +
    "Negative signals (alcohol nearby, expired CICOT, shared kitchen) are surfaced.";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/how-we-verify/`])),
        "x-default": `${SITE.origin}/en/how-we-verify/`,
      },
    },
    openGraph: { title, description, url },
  };
}

// ──────────────────────────────────────────────────────────────────────
// Source list — single source of truth. Each row shows up as a card AND
// inside the JSON-LD Dataset description.
// ──────────────────────────────────────────────────────────────────────
const SOURCES = [
  {
    icon: "★",
    name: "Google Reviews",
    weight: "high",
    detail:
      "Up to 5 most recent + helpful Google Maps reviews per place. Used for rating, sentiment, and detection of muslim-specific signals (halal mentions, prayer space, female staff).",
  },
  {
    icon: "📸",
    name: "Google Photos",
    weight: "medium",
    detail:
      "User-contributed Google Maps photos. Captured for visual proof of halal certification displays, prayer mats, qibla arrows, kitchen separation — and negative signals (alcohol, pork).",
  },
  {
    icon: "▶",
    name: "YouTube",
    weight: "medium",
    detail:
      "Travel vlogger reviews — searched by place name + halal/muslim keywords. Multi-lang transcripts and comment threads cross-verify popularity claims.",
  },
  {
    icon: "💬",
    name: "Reddit",
    weight: "medium",
    detail:
      "Threads from r/MuslimTravel, r/halal, r/saudiarabia, r/UAE, r/Thailand, r/Bangkok, r/Phuket. Strict relevance filter — generic Bangkok mentions don't count.",
  },
  {
    icon: "🇰🇷",
    name: "Naver Blogs",
    weight: "medium",
    detail:
      "Korean blogger reviews (Naver is Korea's dominant search platform). Often the most detailed first-person muslim-traveler accounts.",
  },
  {
    icon: "🇹🇭",
    name: "Pantip",
    weight: "medium",
    detail:
      "Thailand's largest forum. Local Thai muslim community discussions and recommendation threads.",
  },
  {
    icon: "🔗",
    name: "Official website",
    weight: "low-medium",
    detail:
      "When a place has its own site we scan it for halal certification claims, menu transparency, opening hours, and contact info.",
  },
  {
    icon: "🏥",
    name: "Bookimed (medical)",
    weight: "high (clinic niches only)",
    detail:
      "For halal clinics and medical tourism: independent international booking aggregator data — pricing transparency, doctor credentials, female-doctor availability.",
  },
];

// Trust Score factor breakdown — quotable for LLM citations.
const TRUST_FACTORS = [
  { label: "Source diversity (≤25 pts)", body: "How many of the 8 independent sources verified this place. 6+ sources is rare and means very high confidence." },
  { label: "Rating quality (≤15 pts)",   body: "Aggregate rating across reviews — but heavily discounted if review count is low (a single 5-star review carries less than 50 four-stars)." },
  { label: "Review volume (≤15 pts)",    body: "Logarithmic — 500+ reviews is the saturation point. Stops vanity-metric gaming." },
  { label: "Photo volume (≤10 pts)",     body: "User-contributed photos — visual evidence of the place actually existing and operating." },
  { label: "Video volume (≤5 pts)",      body: "YouTube video presence. Bonus signal for popular places among muslim travelers." },
  { label: "Beginner-friendly bonus (≤5 pts)", body: "If review text suggests the place is comfortable for first-time visitors." },
  { label: "Booking-affiliate availability bonus (≤5 pts)", body: "If we can route users to a booking partner (Klook/Agoda/Bookimed) — slight bonus." },
  { label: "Negative-signal penalty (up to −30 pts)", body: "Subtractions if alcohol is visible nearby, kitchen is shared with non-halal, certification has lapsed, or community threads flag the place as no longer halal." },
];

// Negative signals — what we flag transparently.
const NEGATIVES = [
  { sev: "critical", label: "Pork in name/category", detail: "Place name or Google category contains pork/bacon/ham keywords." },
  { sev: "critical", label: "Alcohol in name/category", detail: "Place is a bar, pub, wine shop, brewery, etc. — flagged even if it has 'halal' branding." },
  { sev: "high",     label: "Alcohol mentioned in reviews", detail: "User reviews mention serving alcohol." },
  { sev: "high",     label: "Non-halal kitchen mention", detail: "Reviews say the kitchen is shared with non-halal preparation." },
  { sev: "high",     label: "Expired certification", detail: "Reviews note that CICOT certification has lapsed." },
  { sev: "medium",   label: "Shared utensils", detail: "Reviews mention shared knives/utensils between halal and non-halal items." },
  { sev: "medium",   label: "Dog/pet present", detail: "For users concerned about wudu (ablution) cleanliness." },
];

const FAQS = [
  {
    q: "How does Salaam Thailand verify halal restaurants?",
    a: "Every place is cross-checked across 8 independent sources: Google reviews, Google Maps user photos, YouTube vlogger reviews, Reddit muslim-travel threads, Korean Naver blogs, Thai Pantip forum threads, the place's own official website, and Bookimed (for clinics). A Trust Score from 0 to 100 is computed from how many sources verified it, what they said, and whether any negative signals (alcohol nearby, expired certification, shared kitchen) were flagged.",
  },
  {
    q: "Can businesses pay to rank higher on Salaam Thailand?",
    a: "No. The site has no paid promotion, no sponsored rankings, and no premium slots. Rankings are determined entirely by the computed Trust Score, which combines public data signals only. Businesses cannot influence the Trust Score directly.",
  },
  {
    q: "What's the difference between halal-certified and muslim-friendly on this site?",
    a: "Halal-certified places display an official Thai CICOT (Central Islamic Council of Thailand) certificate, meaning ingredients, preparation, and even kitchen layout were verified. Muslim-friendly places haven't been formally certified but have signals — Arabic menu, prayer space, no pork/alcohol — that make them practical for muslim travelers. Both types are listed but always clearly labelled.",
  },
  {
    q: "Why does Salaam Thailand show negative signals?",
    a: "Most halal directories hide negative information because it upsets business owners. We surface evidence-based negatives — an alcohol bottle visible in a Google Maps photo, a review mentioning shared utensils, an expired CICOT certificate — because muslim travelers deserve full information. Every negative signal cites its source and date, never asserts opinion.",
  },
  {
    q: "How often is data refreshed?",
    a: "Re-enrichment runs weekly via automated scrapers (Klook deep-links, pricing, hours updates). Full re-scrapes of all 8 sources run monthly. Place detail pages revalidate every 12 hours so prayer-time widgets stay current.",
  },
  {
    q: "What languages does Salaam Thailand support?",
    a: "Six languages: English, Korean (한국어), Thai (ภาษาไทย), Chinese (中文), Japanese (日本語), and Arabic (العربية). Every place page and category exists in all six. Reviews and community mentions are aggregated multilingually — Korean Naver, Thai Pantip, Arabic forum threads all feed the same place.",
  },
  {
    q: "Is Salaam Thailand affiliated with CICOT or any halal certification body?",
    a: "No. Salaam Thailand is editorially independent. We reference CICOT certification when a place displays it (verifiable via the official CICOT registry) but we are not a certifier and have no commercial relationship with CICOT or any other halal certification authority.",
  },
];

export default function MethodologyPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How Salaam Thailand verifies muslim-friendly places in Thailand",
      description: "Cross-check process across 8 independent public data sources to compute a Trust Score and detect negative signals.",
      step: SOURCES.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: `Verify via ${s.name}`,
        text: s.detail,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Salaam Thailand Trust Score dataset",
      description:
        "Cross-source verified halal & muslim-friendly directory for Thailand. 2,310 places across 34 categories, each scored 0-100 from 8 independent public-data signals with documented negative-signal penalties.",
      url: `${SITE.origin}/${lang}/how-we-verify/`,
      creator: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      license: `${SITE.origin}/${lang}/about/`,
      keywords: "halal, muslim-friendly, Thailand, directory, trust score, cross-verified",
      isAccessibleForFree: true,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE.name, item: SITE.origin },
        { "@type": "ListItem", position: 2, name: "Methodology", item: `${SITE.origin}/${lang}/how-we-verify/` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-20 sm:px-10">
          <div className="eyebrow mb-2 text-gold-300/90">Methodology</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl">
            How we <span className="text-gradient-gold italic">verify</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Every one of the <strong>2,310 places</strong> on Salaam Thailand is cross-checked across{" "}
            <strong>8 independent public-data sources</strong>. Trust Scores are computed transparently.
            Negative signals are surfaced openly. Businesses cannot pay to influence rankings.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* SOURCES */}
        <section className="mt-14">
          <div className="eyebrow mb-2">The 8 sources</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">What gets cross-checked</h2>
          <p className="mt-3 max-w-2xl text-sm muted">
            No single source is enough. Each place is scanned across all 8 and the signals are combined into one Trust Score.
          </p>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {SOURCES.map((s, i) => (
              <li key={s.name} className="card-editorial p-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl font-black text-gold-700 dark:text-gold-400 tabular-nums">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg" aria-hidden="true">{s.icon}</span>
                      <span className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                        {s.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider muted">weight: {s.weight}</span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                      {s.detail}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="hr-editorial" />

        {/* TRUST SCORE FORMULA */}
        <section>
          <div className="eyebrow mb-2">The math</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">Trust Score 0–100</h2>
          <p className="mt-3 max-w-2xl text-sm muted">
            The score is the weighted sum of these factors. Source diversity is the biggest — a single 5-star review can't beat
            a place with mediocre ratings that 7 different sources have confirmed exists and serves halal food.
          </p>
          <dl className="mt-6 grid gap-3">
            {TRUST_FACTORS.map((f) => (
              <div key={f.label} className="card-editorial p-4">
                <dt className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                  {f.label}
                </dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {f.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs muted">
            Formula constants are adjusted quarterly based on outlier review (top-N and bottom-N places audited by hand).
          </p>
        </section>

        <div className="hr-editorial" />

        {/* NEGATIVE SIGNALS */}
        <section>
          <div className="eyebrow mb-2 text-rose-700 dark:text-rose-400">Honest by design</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">Negative signals we surface</h2>
          <p className="mt-3 max-w-2xl text-sm muted">
            Most halal directories hide these. We don't. Every negative signal cites its source — a photo, a specific review,
            a CICOT registry mismatch — and never asserts opinion.
          </p>
          <ul className="mt-6 space-y-3">
            {NEGATIVES.map((n) => {
              const c =
                n.sev === "critical" ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30" :
                n.sev === "high"     ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30" :
                                       "border-amber-500 bg-amber-50 dark:bg-amber-950/30";
              return (
                <li key={n.label} className={`rounded-xl border-l-4 px-4 py-3 ${c}`}>
                  <div className="flex items-baseline gap-2 text-xs font-bold uppercase tracking-wider text-ink-800 dark:text-ink-100">
                    <span>{n.sev}</span>
                    <span className="opacity-60">·</span>
                    <span>{n.label}</span>
                  </div>
                  <div className="mt-1.5 text-sm leading-snug text-ink-800 dark:text-ink-100">
                    {n.detail}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* FAQ */}
        <section>
          <div className="eyebrow mb-2">Frequently asked</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50">Questions about the method</h2>
          <dl className="mt-6 space-y-5">
            {FAQS.map((f) => (
              <div key={f.q} className="card-editorial p-5">
                <dt className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                  {f.q}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="hr-editorial" />

        {/* CTA */}
        <section className="mt-10">
          <div className="card-editorial p-6 text-center">
            <h3 className="font-display text-2xl font-black text-islam-950 dark:text-islam-50">
              Editorial. Independent. Free.
            </h3>
            <p className="mt-2 text-sm muted">
              No paid promotion, no sponsored rankings, no premium slots. Built so muslim travelers can trust what they see.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href={`/${lang}/`}
                className="rounded-xl bg-islam-900 px-5 py-3 text-sm font-bold text-white hover:bg-islam-800"
              >
                Explore the directory →
              </Link>
              <Link
                href={`/${lang}/wiki/`}
                className="rounded-xl border border-gold-400 bg-gold-50 px-5 py-3 text-sm font-bold text-gold-900 hover:bg-gold-100 dark:bg-gold-950/30 dark:text-gold-200"
              >
                Read the wiki
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
