// Topic encyclopedia wiki article — Wikipedia-style deep-dive entries on
// subjects that don't fit a niche or city. CICOT cert, Ramadan, iftar
// buffets, prayer rooms, etiquette, statistics, etc.
//
// Sections:
//   ١  Intro                    (intro from TOPIC_CONTENT)
//   ٢..N  Body sections          (each topic has 3-5 h3 sections)
//   ★  Key takeaways             (bullet summary at the end)
//   §  References                (curated per topic)
//   §  See also                  (related topics + cities + niches)
//
// JSON-LD: Article (always) + sometimes ItemList for takeaways.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { TOPICS } from "@/lib/wiki-registry";
import { getTopicContent } from "@/lib/topic-content";

import WikiLayout from "@/components/wiki/WikiLayout";
import WikiHeader from "@/components/wiki/WikiHeader";
import WikiSection from "@/components/wiki/WikiSection";
import Infobox from "@/components/wiki/Infobox";
import References, { type Reference } from "@/components/wiki/References";
import SeeAlso, { type SeeAlsoItem } from "@/components/wiki/SeeAlso";

export const dynamic = "force-static";

export function generateStaticParams() {
  const params: Array<{ lang: Lang; slug: string }> = [];
  for (const lang of SUPPORTED_LANGS) {
    for (const t of TOPICS) params.push({ lang, slug: t.slug });
  }
  return params;
}

export async function generateMetadata({ params }: { params: { lang: Lang; slug: string } }): Promise<Metadata> {
  const { lang, slug } = params;
  const content = getTopicContent(slug);
  if (!content) return {};
  return {
    title: `${content.title} — Wiki · ${SITE.name}`,
    description: content.intro.slice(0, 200),
    alternates: {
      canonical: `${SITE.origin}/${lang}/wiki/topic/${slug}/`,
      languages: Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/wiki/topic/${slug}/`])),
    },
  };
}

export default function TopicWikiPage({ params }: { params: { lang: Lang; slug: string } }) {
  const { lang, slug } = params;
  const content = getTopicContent(slug);
  if (!content) notFound();

  // Build References from TopicContent.refs
  const refs: Reference[] = content.refs.map((r, i) => ({
    n: i + 1,
    title: r.title,
    source: r.source,
    url: r.url,
    date: r.date,
  }));

  // Build See also from related topics (next 4 in the registry, wrapping)
  const idx = TOPICS.findIndex((t) => t.slug === slug);
  const related = idx === -1
    ? TOPICS.slice(0, 4)
    : [...TOPICS.slice(idx + 1), ...TOPICS.slice(0, idx)].slice(0, 4);
  const seeAlso: SeeAlsoItem[] = related.map((t) => ({
    href: `/${lang}/wiki/topic/${t.slug}/`,
    label: `${t.emoji} ${t.title}`,
    hint: t.hint,
  }));
  seeAlso.push({ href: `/${lang}/wiki/`, label: "📚 All wiki entries", hint: "browse the index" });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: content.title,
    description: content.intro.slice(0, 250),
    datePublished: "2026-05-31",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.origin },
    mainEntityOfPage: `${SITE.origin}/${lang}/wiki/topic/${slug}/`,
    inLanguage: lang,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <WikiLayout
        aside={
          <Infobox
            title={content.title}
            subtitle="Topic encyclopedia"
            emoji={content.emoji}
            rows={[
              { label: "Type", value: "Encyclopedia entry" },
              { label: "Sections", value: `${content.sections.length} sections` },
              { label: "Takeaways", value: `${content.takeaways.length} key points` },
              { label: "References", value: `${content.refs.length} sources` },
              { label: "Languages", value: "EN · KO · TH · ZH · JA · AR" },
            ]}
            cta={{ label: "All wiki entries", href: `/${lang}/wiki/` }}
            footnote={`Updated ${new Date().toISOString().slice(0, 10)} · editorial content`}
          />
        }
      >
        <WikiHeader
          lang={lang}
          kind="topic"
          title={content.title}
          subtitle={content.intro.split(".")[0] + "."}
          lastModified={new Date().toISOString().slice(0, 10)}
          readMinutes={5}
        />

        {/* §1 Intro */}
        <WikiSection n={1} title="Overview">
          <p className="drop-cap">{content.intro}</p>
        </WikiSection>

        {/* §2..N Body sections */}
        {content.sections.map((s, i) => (
          <WikiSection key={i} n={i + 2} title={s.heading}>
            <p>{s.body}</p>
          </WikiSection>
        ))}

        {/* ★ Takeaways */}
        {content.takeaways.length > 0 && (
          <section className="mt-10 rounded-2xl border border-gold-300/70 bg-gradient-to-br from-gold-50 to-sand-50 p-6 dark:border-gold-700/40 dark:from-gold-950/30 dark:to-ink-900/60">
            <h2 className="mb-3 flex items-baseline gap-3 font-display text-xl font-bold text-gold-900 dark:text-gold-200">
              <span aria-hidden="true">★</span>
              Key takeaways
            </h2>
            <ul className="space-y-2 text-sm">
              {content.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-gold-900 dark:text-gold-200">
                  <span className="mt-0.5 shrink-0 text-gold-700 dark:text-gold-400" aria-hidden="true">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <References refs={refs} />
        <SeeAlso items={seeAlso} />
      </WikiLayout>
    </>
  );
}
