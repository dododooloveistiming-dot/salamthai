import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: `About — ${SITE.name}`,
  description: "Salaam Thailand is an independent halal & muslim-friendly directory built from 6 cross-checked sources. About the team, mission, and why we started.",
};

const TEAM = [
  {
    nameEn: "Yunmin Shin",
    nameNative: "신윤민",
    nativeLabel: "KR",
    role: "Co-founder · Editor & Data",
    bio:
      "Bangkok-based Korean entrepreneur. Built Salaam Thailand after years of being asked by visiting muslim friends, 'where is good halal food here?' — and realizing the honest answer needed cross-checked sources, not paid listings. Also runs Kuncleleaw, a Halal Korean restaurant chain in Bangkok.",
    photoUrl: "/founder.jpg",
  },
  {
    nameEn: "Ardin",
    nameNative: "Thai Muslim",
    nativeLabel: "TH",
    role: "Co-founder · Community & Halal Verification",
    bio:
      "Bangkok-born Thai Muslim. Brings the community access that makes this project legitimate — direct relationships with local imams, halal kitchen operators, and the family-run restaurants across Samae Dam, Bang Khun Thian, and the wider Bangkok muslim community. Verifies halal claims on the ground that no scraper can.",
    photoUrl: "/ardin.jpg",
  },
];

const COMPANY = {
  legalName: "Salaam Thailand",
  taxId: "Sole proprietor",
  address: "99, 1980 Thanon Tha Kham 23, Samae Dam, Bang Khun Thian, Bangkok 10150",
  addressTh: "99, 1980 ถนน ท่าข้าม 23, แสมดำ, บางขุนเทียน, กรุงเทพมหานคร 10150",
  emailContact: "thaiconnect33@gmail.com",
  whatsapp: "+66 61 093 4014",
  whatsappDigits: "66610934014",
  lineOfficial: "@838wyfih",
  startedYear: 2026,
};

const STATS = [
  { label: "Verified places",   value: "760+",  unit: "" },
  { label: "Cross-checked",      value: "6",     unit: "sources" },
  { label: "Languages",          value: "6",     unit: "AR / EN / KO / TH / ZH / JA" },
  { label: "Paid placements",    value: "0",     unit: "ever" },
];

const WE_WONT = [
  { title: "Take money for ranking",        body: "Trust Score is computed before any commercial relationship. A higher payment cannot raise a listing's rank — ever." },
  { title: "Hide affiliate disclosures",     body: "Every booking link is marked rel=\"nofollow sponsored\". The affiliate cut funds the site after the score is set." },
  { title: "Publish without cross-check",    body: "Every listing must have a signal from at least 2 of our 8 sources before going live. Mock claims don't make it in." },
  { title: "Fake reviews or AI hallucinations", body: "Every review we surface is a real one from Google, Reddit, Naver, Pantip, or YouTube — with a link back to the source." },
];

const TECH_STACK = [
  { icon: "▲", name: "Next.js 14",   note: "Static export, ~4,600 pages" },
  { icon: "◐", name: "Vercel",       note: "Edge network" },
  { icon: "≡", name: "Tailwind",     note: "Editorial design tokens" },
  { icon: "✦", name: "Playfair",     note: "Display typography" },
  { icon: "📊", name: "6 scrapers",   note: "Independent data pipelines" },
];

const PRESS = [
  // Placeholders — replace with real outlets after pitches land
  { outlet: "Khaleej Times",   note: "Pitch in progress · expected Q3" },
  { outlet: "Bangkok Post",    note: "Tourism column · pitch in progress" },
  { outlet: "Salaam Gateway",  note: "Pitch in progress" },
  { outlet: "Have Halal Will Travel", note: "Pitch in progress" },
];

const ADVISORS: Array<{ name: string; role: string; affiliation: string }> = [];

export default function AboutPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=2400&h=1200&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-24 sm:px-10 sm:pb-28">
          <div className="eyebrow mb-2 text-gold-300/90">About</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl">
            We verify. <span className="text-gradient-gold italic">No paid placement.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Salaam Thailand is an independent directory of halal restaurants, muslim-friendly hotels,
            tours, mosques, and clinics across Thailand. Every listing is cross-checked across
            6 independent sources before it appears.
          </p>
        </div>
      </section>

      {/* ========== STATS STRIP ========== */}
      <section className="-mt-8 relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-islam-100 sm:grid-cols-4 sm:gap-4 sm:p-6 dark:bg-ink-900 dark:ring-islam-800">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold tabular-nums text-gold-700 dark:text-gold-400 sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-wider muted">{s.label}</div>
              {s.unit && <div className="text-[10px] muted">{s.unit}</div>}
            </div>
          ))}
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {/* ========== MISSION ========== */}
        <section className="mt-16">
          <div className="eyebrow mb-2">Mission</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
            Trust before tourism.
          </h2>
          <div className="prose prose-sm mt-5 max-w-none text-ink-800 dark:text-ink-200 sm:prose-base">
            <p className="drop-cap text-base leading-relaxed">
              Thailand welcomes more muslim travelers every year — from the GCC, Malaysia, Indonesia,
              Korea, and beyond. But the halal landscape is fragmented: some restaurants display
              official CICOT certification, many self-declare "muslim-friendly," and the difference
              matters when you're traveling with family during Ramadan or arriving on a Friday
              before Jum'ah prayer.
            </p>
            <p className="mt-4 text-base leading-relaxed">
              We built Salaam Thailand because the answer to "where can I eat halal in Bangkok?"
              should not come from a sponsored listing. It should come from {" "}
              <strong>independent signals you can audit</strong> —
              Google reviews, Reddit threads, Pantip discussions, Naver blogs, YouTube videos,
              and the property's own website. We cross-check all six before assigning a Trust Score.
              The formula is public. No place can buy a higher rank.
            </p>
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== TEAM ========== */}
        <section>
          <div className="eyebrow mb-2">The team</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
            Built by two co-founders in Bangkok.
          </h2>
          <p className="mt-3 text-sm leading-relaxed muted">
            One Korean operator, one Thai Muslim local — chosen as a pair so that the data
            engineering and the community trust are in the room from day one.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {TEAM.map((m) => (
              <div key={m.nameEn} className="card-editorial p-6">
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.photoUrl}
                    alt={m.nameEn}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-gold-300/60 sm:h-28 sm:w-28"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg font-bold leading-tight text-islam-950 dark:text-islam-50 sm:text-xl">
                      {m.nameEn}
                    </div>
                    <div className="mt-0.5 text-xs muted">
                      <span className="inline-block rounded bg-ink-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                        {m.nativeLabel}
                      </span>{" "}
                      {m.nameNative}
                    </div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider text-gold-700 dark:text-gold-400">
                      {m.role}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {m.bio}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href={`mailto:${COMPANY.emailContact}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-islam-300 bg-white px-4 py-2 text-xs font-bold text-islam-900 transition hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              ✉ Email the founders
            </a>
            <a
              href={`https://wa.me/${COMPANY.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-islam-300 bg-white px-4 py-2 text-xs font-bold text-islam-900 transition hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              <span aria-hidden="true">💬</span> WhatsApp
            </a>
            <a
              href={`https://lin.ee/${COMPANY.lineOfficial.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-islam-300 bg-white px-4 py-2 text-xs font-bold text-islam-900 transition hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              <span aria-hidden="true">📱</span> LINE {COMPANY.lineOfficial}
            </a>
          </div>
        </section>

        {ADVISORS.length > 0 && (
          <>
            <div className="hr-editorial" />
            <section>
              <div className="eyebrow mb-2">Halal advisors</div>
              <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
                Reviewed by community scholars.
              </h2>
              <ul className="mt-6 space-y-4">
                {ADVISORS.map((a, i) => (
                  <li key={i} className="card-editorial p-5">
                    <div className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">{a.name}</div>
                    <div className="text-xs uppercase tracking-wider muted">{a.role} · {a.affiliation}</div>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}

        <div className="hr-editorial" />

        {/* ========== WHAT WE WON'T DO ========== */}
        <section>
          <div className="eyebrow mb-2">Editorial integrity</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
            What we <span className="text-gradient-gold italic">won't</span> do.
          </h2>
          <p className="mt-3 max-w-2xl text-sm muted">
            Trust starts with what's off the table. These are the four lines we publicly commit to never cross.
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {WE_WONT.map((w) => (
              <li key={w.title} className="card-editorial flex gap-3 p-5">
                <span className="shrink-0 text-rose-500" aria-hidden="true">✕</span>
                <div>
                  <h3 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                    {w.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink-700 dark:text-ink-300">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* ========== METHODOLOGY (visual cards) ========== */}
        <section>
          <div className="eyebrow mb-2">Methodology</div>
          <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
            How a place becomes a listing.
          </h2>

          <div className="mt-6 space-y-4">
            {[
              { n: 1, title: "Wide discovery",        body: "Google Maps grid search across 7 major Thai cities, 8-language queries (EN, TH, AR, MS, ID, KO, ZH, JA) for each niche." },
              { n: 2, title: "8-source enrichment",    body: "Google reviews, Google photos, official website, Reddit threads, Pantip threads, Naver blogs, YouTube videos, OpenStreetMap cross-reference — scraped + attached." },
              { n: 3, title: "Halal signal detection", body: "Source text mined for CICOT, prayer room, qibla, halal kitchen, women-only, MUI, etc. across multiple languages." },
              { n: 4, title: "Trust Score",            body: <>Composite of source diversity, review volume, rating, halal signals, community mentions, language coverage. <Link href={`/${lang}/why-us/`} className="link-gold text-islam-700 dark:text-islam-300">Formula is public.</Link></> },
              { n: 5, title: "Suspected viral filter", body: "Listings with very high rating and very few reviews (a known paid-promotion pattern) are flagged with a warning." },
            ].map((step) => (
              <div key={step.n} className="card-editorial flex gap-4 p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-500 to-gold-700 font-display text-lg font-bold text-white">
                  {step.n}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700 dark:text-ink-300">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== TECH STACK ========== */}
        <section>
          <div className="eyebrow mb-2">Built with</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">
            Tech stack
          </h2>
          <p className="mt-2 text-sm muted">
            100% static export · zero server compute · $0/mo at current scale.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {TECH_STACK.map((t) => (
              <li key={t.name} className="rounded-xl border border-ink-100 bg-white p-3 text-center dark:border-ink-800 dark:bg-ink-900">
                <div className="text-2xl text-gold-700 dark:text-gold-400">{t.icon}</div>
                <div className="mt-1 font-bold text-islam-950 dark:text-islam-50">{t.name}</div>
                <div className="text-[10px] muted">{t.note}</div>
              </li>
            ))}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* ========== PRESS (placeholder) ========== */}
        <section>
          <div className="eyebrow mb-2">Press</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">
            As featured in
          </h2>
          <p className="mt-2 text-xs muted">
            We're a newly launched independent project. Press pitches are in progress — outlets below are targets we're actively reaching.
          </p>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PRESS.map((p) => (
              <li key={p.outlet} className="rounded-xl border border-dashed border-ink-200 bg-white p-3 text-center dark:border-ink-700 dark:bg-ink-900">
                <div className="font-display text-sm font-bold text-islam-900 dark:text-islam-100">{p.outlet}</div>
                <div className="mt-1 text-[10px] muted">{p.note}</div>
              </li>
            ))}
          </ul>
        </section>

        <div className="hr-editorial" />

        {/* ========== COMPANY INFO ========== */}
        <section>
          <div className="eyebrow mb-2">Company</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50">Registered details</h2>
          <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
              <dt className="text-[10px] uppercase tracking-wider muted">Legal name</dt>
              <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">{COMPANY.legalName}</dd>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
              <dt className="text-[10px] uppercase tracking-wider muted">Structure</dt>
              <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">{COMPANY.taxId}</dd>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 sm:col-span-2">
              <dt className="text-[10px] uppercase tracking-wider muted">Address</dt>
              <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">{COMPANY.address}</dd>
              <dd className="mt-0.5 text-xs muted" lang="th">{COMPANY.addressTh}</dd>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
              <dt className="text-[10px] uppercase tracking-wider muted">Email</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${COMPANY.emailContact}`} className="font-medium text-islam-700 hover:text-gold-700 dark:text-islam-300">
                  {COMPANY.emailContact}
                </a>
              </dd>
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
              <dt className="text-[10px] uppercase tracking-wider muted">WhatsApp · LINE</dt>
              <dd className="mt-0.5 font-medium text-ink-800 dark:text-ink-200">
                <a href={`https://wa.me/${COMPANY.whatsappDigits}`} target="_blank" rel="noopener noreferrer" className="text-islam-700 hover:text-gold-700 dark:text-islam-300">
                  💬 {COMPANY.whatsapp}
                </a>
                <span className="mx-2 muted">·</span>
                <span className="text-ink-700 dark:text-ink-300">📱 {COMPANY.lineOfficial}</span>
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-xs leading-relaxed muted">
            Salaam Thailand is an independent project. Affiliate commissions from booking partners
            (Klook, Viator, GetYourGuide, Agoda, Bookimed) support the site after the Trust Score
            is computed — never before. No place pays for ranking or visibility.
          </p>
        </section>

        <div className="hr-editorial" />

        {/* ========== CONTACT ========== */}
        <section className="rounded-3xl border border-islam-200 bg-islam-50/40 px-8 py-12 text-center dark:border-islam-800/60 dark:bg-islam-950/20">
          <div className="eyebrow mb-2">Get in touch</div>
          <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
            Have a tip? Spotted bad info?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed muted">
            We rely on local muslim travelers to flag changes. If a listing's halal status has
            shifted, or you know a great place we missed — please write.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <a
              href={`mailto:${COMPANY.emailContact}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-islam-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-islam-900"
            >
              ✉ {COMPANY.emailContact}
            </a>
            <a
              href={`https://wa.me/${COMPANY.whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-islam-300 bg-white px-5 py-2.5 text-sm font-bold text-islam-900 transition hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              💬 WhatsApp {COMPANY.whatsapp}
            </a>
            <a
              href={`https://lin.ee/${COMPANY.lineOfficial.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-islam-300 bg-white px-5 py-2.5 text-sm font-bold text-islam-900 transition hover:border-gold-400 hover:bg-gold-50 dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              📱 LINE {COMPANY.lineOfficial}
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
