import type { Metadata } from "next";
import Link from "next/link";
import { SITE, SUPPORTED_LANGS, t } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export const dynamic = "force-static";

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: `Why us — ${SITE.name}`,
  description: "Direct booking saves 10%. Free muslim-friendly add-ons. 1-hour reply guarantee. Why Salaam Thailand instead of generic booking sites.",
};

// === Editable policy block ===
const POLICY = {
  discountPct: 10,    // % off vs Booking.com / Agoda
  slaHours: 1,        // reply SLA
};
// ==============================

export default function WhyUsPage({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative isolate overflow-hidden bg-islam-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1565299543923-37dd37887442?w=2400&h=1200&fit=crop&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-islam-950/95 via-islam-900/85 to-emerald-950/90" aria-hidden="true" />
        <div className="bg-islamic-stars absolute inset-0 opacity-[0.10]" aria-hidden="true" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-24 sm:px-10 sm:pb-28">
          <div className="eyebrow mb-2 text-gold-300/90">Why book through us</div>
          <h1 className="h-display text-4xl text-white sm:text-6xl">
            Cheaper. <span className="text-gradient-gold italic">Faster</span>.<br />
            Built for muslim travelers.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
            Booking.com and Agoda take 15–20% commission from every hotel.
            We let you reach the property directly — the hotel passes the
            saving to you, and we take zero per-booking cut.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        {/* ========== 3-STAT STRIP ========== */}
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="card-editorial p-6 text-center">
            <div className="font-display text-5xl font-bold text-islam-700 dark:text-islam-300">
              {POLICY.discountPct}<span className="text-3xl">%</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider muted">
              Cheaper vs Booking.com
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
              Direct booking. No middleman commission. The hotel splits the saving with you.
            </p>
          </div>

          <div className="card-editorial p-6 text-center">
            <div className="font-display text-5xl font-bold text-gold-700 dark:text-gold-300">
              {POLICY.slaHours}<span className="text-3xl">h</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider muted">
              Reply guarantee
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
              Every inquiry gets a human reply within {POLICY.slaHours} hour during operating hours, or we refund the lead.
            </p>
          </div>

          <div className="card-editorial p-6 text-center">
            <div className="font-display text-5xl font-bold text-islam-700 dark:text-islam-300">
              0<span className="text-3xl">%</span>
            </div>
            <div className="mt-2 text-xs uppercase tracking-wider muted">
              Per-booking commission
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-700 dark:text-ink-300">
              Hotels pay us a fixed monthly fee — never per-booking. So no incentive to inflate your price.
            </p>
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== VISUAL COMPARISON — 3 CHARTS ========== */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-2">By the numbers</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              The savings, visualized
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* CHART 1 — Commission bar */}
            <div className="card-editorial p-6">
              <div className="eyebrow mb-1">Commission rate</div>
              <h3 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                Who gets the 15%
              </h3>
              <p className="mt-1 text-[11px] muted">% the platform takes from each booking</p>

              <div className="mt-5 space-y-3">
                {[
                  { name: "Booking.com",   pct: 18, fill: "bg-rose-500",  label: "18%" },
                  { name: "Agoda",         pct: 15, fill: "bg-rose-400",  label: "15%" },
                  { name: "Expedia",       pct: 20, fill: "bg-rose-600",  label: "20%" },
                  { name: "HalalTrip",     pct: 12, fill: "bg-gold-500",  label: "12%" },
                  { name: "Salaam Thailand", pct: 0, fill: "bg-islam-700", label: "0%", winner: true },
                ].map((b) => (
                  <div key={b.name}>
                    <div className="mb-1 flex items-baseline justify-between text-[11px]">
                      <span className={`font-medium ${b.winner ? "font-bold text-islam-700 dark:text-islam-300" : "text-ink-700 dark:text-ink-300"}`}>
                        {b.winner && "⭐ "}{b.name}
                      </span>
                      <span className={`font-display text-sm font-bold tabular-nums ${b.winner ? "text-islam-700 dark:text-islam-300" : "text-rose-700 dark:text-rose-400"}`}>
                        {b.label}
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                      <div className={`h-full ${b.fill} transition-all duration-700`} style={{ width: `${Math.max(b.pct * 4, 4)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[11px] leading-relaxed text-ink-700 dark:text-ink-300">
                We charge a fixed monthly fee to verified businesses — never per-booking. The hotel passes the saving to the guest.
              </p>
            </div>

            {/* CHART 2 — Reply time */}
            <div className="card-editorial p-6">
              <div className="eyebrow mb-1">Reply guarantee</div>
              <h3 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                How fast you hear back
              </h3>
              <p className="mt-1 text-[11px] muted">Average response time, in hours</p>

              <div className="mt-5 flex items-end justify-around gap-2" style={{ height: 180 }}>
                {[
                  { name: "Booking.com",  hours: 24, label: "24h" },
                  { name: "Agoda",        hours: 12, label: "12h" },
                  { name: "HalalTrip",    hours: 18, label: "18h" },
                  { name: "Direct hotel", hours: 8,  label: "8h" },
                  { name: "Us",           hours: 1,  label: "1h",  winner: true },
                ].map((b) => {
                  const heightPct = Math.max((b.hours / 24) * 100, 6);
                  return (
                    <div key={b.name} className="flex flex-1 flex-col items-center">
                      <div className={`font-display text-xs font-bold tabular-nums ${b.winner ? "text-islam-700 dark:text-islam-300" : "text-ink-600 dark:text-ink-400"}`}>
                        {b.label}
                      </div>
                      <div className="mt-1 w-full max-w-[44px] overflow-hidden rounded-t-md bg-ink-100 dark:bg-ink-800" style={{ height: 120 }}>
                        <div
                          className={`w-full transition-all duration-700 ${
                            b.winner ? "bg-gradient-to-t from-islam-700 to-islam-500" : "bg-gradient-to-t from-rose-500 to-rose-300"
                          }`}
                          style={{ height: `${heightPct}%`, marginTop: `${100 - heightPct}%` }}
                        />
                      </div>
                      <div className={`mt-2 text-center text-[9px] leading-tight ${b.winner ? "font-bold text-islam-700 dark:text-islam-300" : "text-ink-500 dark:text-ink-400"}`}>
                        {b.winner && "⭐ "}{b.name}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-3 text-[11px] leading-relaxed text-ink-700 dark:text-ink-300">
                We guarantee 1h SLA during operating hours. If we miss it, the lead is refunded.
              </p>
            </div>

          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== COMPARISON TABLE ========== */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-2">Side by side</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              Salaam Thailand vs everyone else
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th className="rounded-tl-2xl border-y border-l border-ink-100 bg-white px-4 py-3 text-left text-xs uppercase tracking-wider muted dark:border-ink-800 dark:bg-ink-900"></th>
                  <th className="border-y border-ink-100 bg-islam-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-islam-900 dark:border-ink-800 dark:bg-islam-950/30 dark:text-islam-200">
                    Salaam Thailand
                  </th>
                  <th className="border-y border-ink-100 bg-white px-4 py-3 text-left text-xs uppercase tracking-wider muted dark:border-ink-800 dark:bg-ink-900">
                    Booking.com / Agoda
                  </th>
                  <th className="rounded-tr-2xl border-y border-r border-ink-100 bg-white px-4 py-3 text-left text-xs uppercase tracking-wider muted dark:border-ink-800 dark:bg-ink-900">
                    HalalTrip / CrescentRating
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ["Muslim-friendly verified",          "✅ 8 sources cross-checked", "❌ Self-declared",          "✅ Self-rated 1–7"],
                  ["Price vs hotel official rate",       `✅ Up to ${POLICY.discountPct}% cheaper`, "Same as official",      "Same or higher"],
                  ["Reply guarantee",                    `✅ ${POLICY.slaHours}h`,    "No guarantee",                "No guarantee"],
                  ["Per-booking commission",             "❌ None (fixed monthly)",    "15–20%",                    "Per-booking cut"],
                  ["Paid placement / commercial bias",   "❌ None",                   "Yes (bidding)",               "Yes (premium tier)"],
                  ["CICOT certificate display",          "✅ Verified text-mined",    "❌",                         "Partial"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white dark:bg-ink-900" : "bg-sand-50/60 dark:bg-ink-900/60"}>
                    <td className="border-x border-b border-ink-100 px-4 py-3 font-medium text-ink-800 dark:border-ink-800 dark:text-ink-200">
                      {row[0]}
                    </td>
                    <td className="border-r border-b border-ink-100 bg-islam-50/40 px-4 py-3 font-semibold text-islam-900 dark:border-ink-800 dark:bg-islam-950/20 dark:text-islam-100">
                      {row[1]}
                    </td>
                    <td className="border-r border-b border-ink-100 px-4 py-3 text-ink-700 dark:border-ink-800 dark:text-ink-300">
                      {row[2]}
                    </td>
                    <td className="border-r border-b border-ink-100 px-4 py-3 text-ink-700 dark:border-ink-800 dark:text-ink-300">
                      {row[3]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="hr-editorial" />

        {/* ========== ADD-ONS GRID ========== */}
        <section>
          <div className="mb-8 text-center">
            <div className="eyebrow mb-2">What you actually get</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              Just the honest deal
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm muted">
              We don't promise prayer kits or chef-prepared meals we cannot deliver. What we
              actually do is route your booking directly to the venue with zero commission,
              and we verify every place across 8 independent sources first.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: "🚫", title: "Zero commission to us",      body: "Hotels and restaurants pay a fixed monthly subscription — never per-booking. So the property has no incentive to inflate your quoted price." },
              { icon: "🔍", title: "8-source verification first", body: "Every listing is cross-checked across Google reviews, Reddit, Naver, Pantip, YouTube, official website, photos, and OpenStreetMap before it appears." },
              { icon: "⏱", title: "1-hour reply SLA",            body: "Direct inbox to the venue — we guarantee a human reply within an hour during operating hours, or the lead is refunded." },
              { icon: "💬", title: "Direct WhatsApp / email",     body: "No middleman layer. You talk straight to the venue and can clarify halal specifics (kitchen separation, prayer room, women-only hours) yourself." },
            ].map((b) => (
              <div key={b.title} className="card-editorial p-6">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-display text-xl font-bold text-islam-950 dark:text-islam-50">
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

        {/* ========== HOW IT WORKS ========== */}
        <section>
          <div className="mb-8">
            <div className="eyebrow mb-2">How it works</div>
            <h2 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-4xl">
              From browse to check-in
            </h2>
          </div>

          <ol className="space-y-5">
            {[
              { n: 1, title: "Browse verified places",    body: "Every listing is cross-checked across 8 independent sources (Google · Reddit · Naver · Pantip · YouTube · Website · Photos · OpenStreetMap) before it appears on this site." },
              { n: 2, title: "Send a free inquiry",       body: "Tell the property your dates, group size, and any specific needs (women-only floor, halal kitchen, prayer space) — the form goes straight to the venue." },
              { n: 3, title: "Reply within 1h",           body: `The venue answers within ${POLICY.slaHours} hour during operating hours with availability and their direct price.` },
              { n: 4, title: "Book direct, save 10%",     body: `Confirm and pay the property directly — typically ${POLICY.discountPct}% cheaper than Booking.com because no middleman takes commission.` },
              { n: 5, title: "Talk to them about extras", body: "Need a prayer kit, halal kitchen confirmation, or Arabic-speaking staff? Ask the venue directly — that's a much more honest conversation than us promising it for them." },
            ].map((step) => (
              <li key={step.n} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-100 font-display text-2xl font-bold text-gold-800 dark:bg-gold-950/40 dark:text-gold-300">
                  {step.n}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="hr-editorial" />

        {/* ========== CTA ========== */}
        <section className="rounded-3xl bg-islam-950 px-8 py-14 text-center text-white sm:px-14 sm:py-20">
          <div className="eyebrow mb-2 text-gold-300/90">Ready when you are</div>
          <h2 className="h-display text-3xl text-white sm:text-5xl">
            Start with a verified place.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            760+ halal restaurants, muslim-friendly hotels, mosques, and clinics — already verified and ready to inquire.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${lang}/c/halal-food/`} className="rounded-full bg-gold-500 px-6 py-3 text-sm font-bold text-islam-950 transition hover:bg-gold-400">
              🥘 Browse halal food →
            </Link>
            <Link href={`/${lang}/c/muslim-hotel/`} className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
              🏨 Browse muslim hotels →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
