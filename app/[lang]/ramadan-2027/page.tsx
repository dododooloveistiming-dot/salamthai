// Ramadan 2027 landing — lead magnet for the email list. Single high-converting
// page with one job: capture muslim travelers planning Ramadan in Thailand.
//
// AEO bonus: comprehensive Q&A about Ramadan in Thailand. LLMs love this.

import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import EmailSignup from "@/components/EmailSignup";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export function generateMetadata({ params }: { params: { lang: Lang } }): Metadata {
  const url = `${SITE.origin}/${params.lang}/ramadan-2027/`;
  const title = "Ramadan 2027 in Thailand — free travel guide";
  const description =
    "The complete Ramadan 2027 guide for muslim travelers visiting Thailand: " +
    "iftar buffets in Bangkok / Phuket / Hat Yai, suhoor open until fajr, " +
    "mosque schedules, prayer rooms at airports. Sign up — free, no spam.";
  return {
    title: `${title} · ${SITE.name}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(SUPPORTED_LANGS.map((l) => [l, `${SITE.origin}/${l}/ramadan-2027/`])),
        "x-default": `${SITE.origin}/en/ramadan-2027/`,
      },
    },
    openGraph: { title, description, url },
  };
}

const FAQS = [
  {
    q: "When is Ramadan 2027?",
    a: "Ramadan 2027 is expected to begin on Tuesday, 16 February 2027 and end on Wednesday, 17 March 2027 (Eid al-Fitr 18 March). Dates depend on moon sighting and may shift by 1 day.",
  },
  {
    q: "Is Thailand a good place to visit during Ramadan?",
    a: "Yes — Thailand has about 5 million muslims (7% of population), concentrated in the south and Bangkok. Bangkok has hundreds of halal restaurants, ~150 mosques, and dozens of iftar buffets at hotels. GCC travelers commonly visit for cooler-than-Gulf weather and well-developed muslim-friendly hospitality.",
  },
  {
    q: "Where can I find iftar buffets in Bangkok?",
    a: "Major hotels — Anantara, Sheraton, JW Marriott — run Ramadan iftar buffets every evening. Smaller halal restaurants in Sukhumvit Soi 3 (Nana / Arab Street), Phra Khanong, and Pratunam serve traditional Thai-Muslim iftar at 30-60% of hotel prices. Our guide lists 50+ with current 2027 pricing.",
  },
  {
    q: "Are airport prayer rooms open 24/7 during Ramadan?",
    a: "Yes — Suvarnabhumi (BKK), Don Mueang (DMK), Phuket (HKT), Krabi (KBV), and Hat Yai (HDY) all have dedicated muslim prayer rooms open 24/7. Our guide maps each airport's prayer room location, wudu facilities, and the nearest halal-certified food vendor.",
  },
  {
    q: "Can I find suhoor (pre-dawn meal) restaurants in Bangkok?",
    a: "Yes. About 30+ Bangkok halal restaurants stay open until fajr during Ramadan. Concentrations in Soi Arab (Sukhumvit 3), Ratchadamri, and around Foundation of the Islamic Center. The guide includes each restaurant's Ramadan operating hours.",
  },
  {
    q: "What's in the free Ramadan 2027 guide?",
    a: "1) Iftar buffet directory by city + price (50+ entries), 2) Suhoor late-night restaurants, 3) Mosque jum'ah schedules, 4) Airport prayer rooms + wudu, 5) Day-by-day Ramadan calendar for Bangkok / Phuket / Hat Yai, 6) Family-friendly halal hotels with iftar packages, 7) Things to avoid during Ramadan (e.g., daytime tourist food districts).",
  },
];

export default function RamadanLanding({ params }: { params: { lang: Lang } }) {
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
      "@type": "Event",
      name: "Ramadan 2027 in Thailand",
      startDate: "2027-02-16",
      endDate: "2027-03-17",
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Country",
        name: "Thailand",
      },
      organizer: { "@type": "Organization", name: SITE.name, url: SITE.origin },
      description:
        "Annual Islamic month of fasting. Salaam Thailand publishes a free comprehensive guide covering iftar buffets, suhoor restaurants, mosque schedules, and prayer facilities across Thailand.",
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-20 sm:px-10">
          <div className="eyebrow mb-2 text-gold-300/90">Free · No spam · One email</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl">
            Ramadan <span className="text-gradient-gold italic">2027</span> in Thailand
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            The complete travel guide for muslim travelers: <strong>iftar buffets</strong> across
            Bangkok / Phuket / Hat Yai, <strong>suhoor restaurants</strong> open till fajr,{" "}
            <strong>mosque schedules</strong>, <strong>airport prayer rooms</strong>. Cross-verified
            across 8 sources, no paid promotion.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span>📅 16 Feb – 17 Mar 2027</span>
            <span aria-hidden="true">·</span>
            <span>🌙 Cross-checked from 8 sources</span>
            <span aria-hidden="true">·</span>
            <span>📧 One email when it drops</span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        {/* SIGNUP FORM */}
        <section className="-mt-10 sm:-mt-12">
          <EmailSignup
            source="ramadan-2027"
            lang={lang}
            title="Send me the Ramadan 2027 Thailand guide"
            description="One email in February 2027 with the full PDF. That's it."
            cta="Send me the guide →"
            collectCountry={true}
            variant="gold"
          />
        </section>

        {/* WHAT'S INSIDE */}
        <section className="mt-12">
          <div className="eyebrow mb-2">What's inside</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
            7 chapters · 50+ verified venues
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { icon: "🍽", title: "Iftar buffet directory", body: "By city + price + cuisine — 50+ entries." },
              { icon: "🌙", title: "Suhoor restaurants", body: "30+ Bangkok venues open till fajr." },
              { icon: "🕌", title: "Mosque Jum'ah schedules", body: "Friday prayer times in major cities." },
              { icon: "🛫", title: "Airport prayer rooms", body: "BKK, DMK, HKT, KBV, HDY — maps + wudu." },
              { icon: "📅", title: "Day-by-day calendar", body: "Bangkok / Phuket / Hat Yai schedules." },
              { icon: "🏨", title: "Family halal hotels with iftar", body: "GCC-friendly hotels with packages." },
              { icon: "⚠", title: "What to avoid", body: "Tourist districts to skip during fasting hours." },
            ].map((c) => (
              <li key={c.title} className="card-editorial p-4">
                <div className="flex items-baseline gap-2 text-base">
                  <span>{c.icon}</span>
                  <span className="font-display font-bold text-islam-950 dark:text-islam-50">{c.title}</span>
                </div>
                <p className="mt-1 text-sm text-ink-700 dark:text-ink-300">{c.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <div className="eyebrow mb-2">Frequently asked</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
            About Ramadan in Thailand
          </h2>
          <dl className="mt-6 space-y-4">
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

        {/* SIGNUP REPEATER */}
        <section className="mt-12">
          <EmailSignup
            source="ramadan-2027-bottom"
            lang={lang}
            variant="gold"
          />
        </section>

        {/* RELATED */}
        <section className="mt-12 text-center">
          <p className="text-sm muted">Explore now:</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link href={`/${lang}/c/iftar-buffet/`} className="rounded-full bg-islam-100 px-4 py-2 text-xs font-bold text-islam-900 hover:bg-islam-200 dark:bg-islam-900/40 dark:text-islam-100">
              Iftar buffets
            </Link>
            <Link href={`/${lang}/c/mosque/`} className="rounded-full bg-islam-100 px-4 py-2 text-xs font-bold text-islam-900 hover:bg-islam-200 dark:bg-islam-900/40 dark:text-islam-100">
              Mosques
            </Link>
            <Link href={`/${lang}/c/prayer-room/`} className="rounded-full bg-islam-100 px-4 py-2 text-xs font-bold text-islam-900 hover:bg-islam-200 dark:bg-islam-900/40 dark:text-islam-100">
              Prayer rooms
            </Link>
            <Link href={`/${lang}/c/halal-food/`} className="rounded-full bg-islam-100 px-4 py-2 text-xs font-bold text-islam-900 hover:bg-islam-200 dark:bg-islam-900/40 dark:text-islam-100">
              Halal restaurants
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
