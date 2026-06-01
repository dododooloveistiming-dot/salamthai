import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: `For halal businesses in Thailand — ${SITE.name}`,
  description: "Claim your verified listing on Salaam Thailand. Reach GCC + Malaysian + Korean muslim travelers. Free 10 inquiries/month, ฿599 for unlimited.",
};

const BENEFITS = [
  { icon: "🌍", title: "GCC + SEA + Korean traffic",      body: "Salaam Thailand is built for the 8M+ muslim travelers visiting Thailand each year. We reach 6 language markets — Arabic, Malay, Indonesian, Korean, English, Thai." },
  { icon: "✓",  title: "Verified independently",           body: "Listing comes pre-cross-checked against 6 sources. Your Trust Score is set the day you claim — no submission process, no waiting." },
  { icon: "📥", title: "Inquiries direct to inbox",        body: "Every interested visitor sends an inquiry that lands in your dashboard inbox. Reply in 1 hour and the lead stays warm." },
  { icon: "📊", title: "See your numbers",                 body: "Trust Score breakdown, anonymized competitor benchmarks, weekly insight digest, and an action list to grow rank." },
  { icon: "🌙", title: "Muslim-friendly extras",           body: "We pre-tag listings with prayer kit, qibla, halal kitchen, women-only hours — whatever matches reality. Booking.com cannot do this." },
  { icon: "🚫", title: "No paid placement, ever",          body: "Featured plan is clearly labeled. The Trust Score itself cannot be bought. This is what makes our directory trustworthy — and visitors loyal." },
];

const PLANS = [
  {
    name: "Free",
    price: "฿0",
    period: "/month",
    perks: ["10 inquiries / month", "Listed publicly", "Basic verification badge", "—"],
    cta: "Claim free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "฿599",
    period: "/month",
    perks: ["Unlimited inquiries", "1-hour reply SLA", "Insights · benchmarks", "Multi-language inquiry routing"],
    cta: "Go Pro · QR pay",
    highlight: true,
  },
  {
    name: "Featured",
    price: "฿1,999",
    period: "/month",
    perks: ["Everything in Pro", "Top placement in category", "Named competitor benchmarks", "Priority placement in AEO"],
    cta: "Upgrade · QR pay",
    highlight: false,
  },
];

const NUMBERS_THAT_MATTER = [
  { value: "8M+",  label: "Muslim travelers to Thailand per year (2024)" },
  { value: "47%",  label: "GCC tourism growth in last 24 months" },
  { value: "฿38K", label: "Average GCC family spend per trip" },
  { value: "1.4B", label: "Global muslim travel market (USD)" },
];

const FAQ = [
  { q: "Do I have to sign up to be listed?",
    a: "No. If your business shows up in our cross-source verification, you're already listed. Claiming the listing only gives you access to inquiries, dashboard, and the ability to edit details. We list places regardless of whether they pay us." },
  { q: "How does Salaam Thailand make money?",
    a: "Two streams — (1) Pro subscriptions from verified businesses who want the inquiry inbox and dashboard analytics, and (2) Affiliate commissions on Klook / Viator / Agoda / Bookimed bookings, applied only after the independent Trust Score is computed. We do not take per-booking commissions from listed businesses." },
  { q: "Can I pay anything to boost my rank?",
    a: "No. Featured tier gives you placement at the TOP of category, clearly labeled 'Featured.' But your Trust Score itself cannot move. That's the contract that keeps users coming back." },
  { q: "What if I get more than 10 inquiries on the free plan?",
    a: "Inquiries 11+ in the month are queued. You see them after upgrading. Most claimed listings exceed 10/month within 60 days as our SEO + AEO presence grows." },
  { q: "How is the Trust Score calculated?",
    a: "Cross-source diversity (5 of 6 sources = better than 2), Google review volume + average, photo coverage, video coverage, halal-signal text matches across multiple languages, community mentions on Reddit / Naver / Pantip. The formula is in our About page methodology section." },
  { q: "Why ฿599 — Booking.com is free for me to list there?",
    a: "Booking.com takes 15–20% commission per booking. ฿599 vs. 18% of one booking — if your average room rate is ฿3,500/night, the threshold is roughly 1 booking per month. Most Pro tier hotels get 20–40 inquiries per month." },
  { q: "How do I cancel?",
    a: "Email thaiconnect33@gmail.com or message us on WhatsApp +66 61 093 4014 / LINE @838wyfih. Refunds prorated to the day. Your listing stays public — only the dashboard access expires." },
];

export default function ForBusinessPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2400&h=1200&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 sm:px-10 sm:pb-28">
          <div className="eyebrow mb-2 text-gold-300/90">For halal businesses</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl lg:text-7xl">
            Reach 8 million<br />
            <span className="text-gradient-gold italic">muslim travelers</span> a year.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            If you run a halal restaurant, muslim-friendly hotel, mosque, clinic, beauty salon,
            or tour business in Thailand — you're already verified by our independent system.
            Claim your listing in 60 seconds to get inquiries, dashboard, and direct guest contact.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/dashboard/`}
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-islam-950 shadow-md transition hover:bg-gold-400"
            >
              🚀 See dashboard preview
            </Link>
            <a
              href="#plans"
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              View plans ↓
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* ========== STAT STRIP ========== */}
        <section className="-mt-12 relative z-10">
          <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-islam-100 sm:grid-cols-4 sm:gap-4 sm:p-6 dark:bg-ink-900 dark:ring-islam-800">
            {NUMBERS_THAT_MATTER.map((n) => (
              <div key={n.label} className="text-center">
                <div className="font-display text-3xl font-bold tabular-nums text-gold-700 dark:text-gold-400 sm:text-4xl">
                  {n.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider muted">{n.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ========== BENEFITS ========== */}
        <section className="mt-20">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-2">Why list</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              What you get
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="card-editorial p-6">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-display text-lg font-bold text-islam-950 dark:text-islam-50">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== DASHBOARD PREVIEW ========== */}
        <section>
          <div className="mb-8 text-center">
            <div className="eyebrow mb-2">Your dashboard</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              What you'll see every morning
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm muted">
              Daily digest · inquiry inbox · trust score breakdown · competitor benchmarks · streak gamification.
            </p>
          </div>

          <div className="rounded-2xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 p-6 dark:border-islam-800/60 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/40 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 shadow dark:bg-ink-900">
                <div className="eyebrow mb-1 !text-[10px]">Today's digest</div>
                <h4 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                  Good morning, Al Meroz.
                </h4>
                <ul className="mt-3 space-y-2 text-xs">
                  <li className="rounded-md border-l-2 border-rose-400 bg-rose-50/50 px-3 py-2 dark:bg-rose-950/20">⏰ 1 inquiry waiting · 47 min left on SLA</li>
                  <li className="rounded-md border-l-2 border-gold-400 bg-gold-50/50 px-3 py-2 dark:bg-gold-950/20">📈 Trust Score up 2 points this week</li>
                </ul>
              </div>
              <div className="rounded-xl bg-white p-4 shadow dark:bg-ink-900">
                <div className="eyebrow mb-1 !text-[10px]">Streaks</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-rose-50 p-2 text-center dark:bg-rose-950/20">
                    <div className="text-lg">🔥</div>
                    <div className="font-display text-lg font-bold">23</div>
                    <div className="text-[9px] muted">SLA streak (days)</div>
                  </div>
                  <div className="rounded-md bg-gold-50 p-2 text-center dark:bg-gold-950/20">
                    <div className="text-lg">🏆</div>
                    <div className="font-display text-lg font-bold">3</div>
                    <div className="text-[9px] muted">Top in city (months)</div>
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow dark:bg-ink-900">
                <div className="eyebrow mb-1 !text-[10px]">AI insight</div>
                <p className="text-xs leading-relaxed">🇸🇦 <strong>GCC bookings +41%</strong> of revenue this quarter — consider an Arabic landing page.</p>
              </div>
              <div className="rounded-xl bg-white p-4 shadow dark:bg-ink-900">
                <div className="eyebrow mb-1 !text-[10px]">Live activity</div>
                <ul className="space-y-1.5 text-[11px]">
                  <li>👁 just now · 🇸🇦 Riyadh viewing</li>
                  <li>👁 2m ago · 🇲🇾 KL viewing</li>
                  <li>✉ 13m ago · new inquiry · 🇸🇦 Ahmed</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href={`/${lang}/dashboard/`}
                className="inline-flex items-center gap-2 rounded-full bg-islam-950 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-islam-900"
              >
                🚀 Open full dashboard preview →
              </Link>
            </div>
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== PLANS ========== */}
        <section id="plans">
          <div className="mb-10 text-center">
            <div className="eyebrow mb-2">Pricing</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              Start free. Scale when ready.
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm muted">
              Pay via QR — PromptPay, Thai bank transfer, KakaoPay, WeChat, USDT, cash. No credit card needed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={`card-editorial p-6 ${p.highlight ? "border-gold-400 ring-2 ring-gold-300/50" : ""}`}
              >
                {p.highlight && (
                  <div className="mb-3 inline-block rounded-md bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-islam-950">
                    Most popular
                  </div>
                )}
                <div className="font-display text-2xl font-bold text-islam-950 dark:text-islam-50">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-gold-700 dark:text-gold-400">{p.price}</span>
                  <span className="text-xs muted">{p.period}</span>
                </div>
                <ul className="mt-5 space-y-2 text-xs">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2">
                      <span className="mt-0.5 text-islam-600 dark:text-islam-400">{perk === "—" ? "·" : "✓"}</span>
                      <span className="text-ink-800 dark:text-ink-200">{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${lang}/dashboard/billing/`}
                  className={`mt-6 block rounded-md px-4 py-2.5 text-center text-xs font-bold transition ${
                    p.highlight
                      ? "bg-islam-950 text-white hover:bg-islam-900"
                      : "border border-islam-300 text-islam-900 hover:bg-islam-50 dark:border-islam-700 dark:text-islam-100"
                  }`}
                >
                  {p.cta} →
                </Link>
              </div>
            ))}
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== CLAIM CTA ========== */}
        <section className="rounded-3xl bg-islam-950 px-8 py-14 text-center text-white sm:px-14 sm:py-20">
          <div className="eyebrow mb-2 text-gold-300/90">Ready in 60 seconds</div>
          <h2 className="h-display text-3xl text-white sm:text-5xl">
            Claim your listing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Type your business name, verify ownership (email or phone), and the dashboard opens.
            Free plan works forever — upgrade only when you exceed 10 inquiries / month.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={`/${lang}/search/`}
              className="rounded-full bg-gold-500 px-7 py-3.5 text-sm font-bold text-islam-950 transition hover:bg-gold-400"
            >
              🔍 Find your listing →
            </Link>
            <a
              href="mailto:hello@salaamthailand.com"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
            >
              ✉ Ask before signing up
            </a>
          </div>
        </section>

        {/* ========== FAQ ========== */}
        <section className="mt-16">
          <div className="mb-6 text-center">
            <div className="eyebrow mb-2">Common questions</div>
            <h2 className="h-display text-2xl text-islam-950 dark:text-islam-50 sm:text-3xl">
              FAQ
            </h2>
          </div>
          <div className="divide-y divide-islam-100 rounded-2xl border border-islam-100 bg-white dark:divide-islam-800/40 dark:border-islam-800/40 dark:bg-ink-900">
            {FAQ.map((f, i) => (
              <details key={i} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-start justify-between gap-3 text-sm font-bold text-islam-900 dark:text-islam-100">
                  <span className="flex-1">{f.q}</span>
                  <span className="shrink-0 text-gold-600 transition group-open:rotate-45 dark:text-gold-400" aria-hidden="true">
                    ✚
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-700 dark:text-ink-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
