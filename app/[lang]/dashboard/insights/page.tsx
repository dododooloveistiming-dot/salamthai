import {
  MOCK_BUSINESS,
  MOCK_TRUST_BREAKDOWN,
  MOCK_COMPETITORS,
  MOCK_TRUST_TIPS,
  MOCK_DAILY,
} from "@/lib/dashboard-mock";
import TrustGauge from "@/components/TrustGauge";
import type { Lang } from "@/lib/types";

export default function InsightsPage({ params }: { params: { lang: Lang } }) {
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Header */}
      <header>
        <div className="eyebrow mb-1">Insights</div>
        <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
          Why you rank {MOCK_BUSINESS.rank_in_city}st in {MOCK_BUSINESS.city}
        </h1>
        <p className="mt-1 text-sm muted">
          Independent score breakdown · anonymized competitor comparison · actionable wins
        </p>
      </header>

      {/* Trust Gauge + Breakdown */}
      <section className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="card-editorial flex flex-col items-center p-6">
          <div className="self-start">
            <div className="eyebrow mb-1">Your Trust Score</div>
            <div className="text-[11px] muted">Updated daily across 6 sources</div>
          </div>
          <div className="mt-5">
            <TrustGauge score={MOCK_BUSINESS.trust_score} size={180} />
          </div>
          <div className="mt-4 text-center text-xs muted">
            <div>Rank <strong className="text-islam-900 dark:text-islam-100">#{MOCK_BUSINESS.rank_in_city}</strong> of {MOCK_BUSINESS.total_in_city} in city</div>
            <div>Rank <strong className="text-islam-900 dark:text-islam-100">#{MOCK_BUSINESS.rank_in_thailand}</strong> of {MOCK_BUSINESS.total_in_thailand} nationally</div>
          </div>
        </div>

        <div className="card-editorial p-5 sm:p-6">
          <div className="mb-4">
            <div className="eyebrow mb-1">Score components</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              How {MOCK_BUSINESS.trust_score} points are earned
            </h2>
          </div>
          <ul className="space-y-3">
            {MOCK_TRUST_BREAKDOWN.map((b) => {
              const pct = Math.round((b.earned / b.max) * 100);
              const barColor = b.color === "islam"
                ? "bg-islam-600 dark:bg-islam-500"
                : "bg-gold-500 dark:bg-gold-400";
              return (
                <li key={b.label}>
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="font-medium text-ink-800 dark:text-ink-200">{b.label}</span>
                    <span className="font-bold tabular-nums text-islam-900 dark:text-islam-100">
                      {b.earned} <span className="text-[10px] muted">/ {b.max}</span>
                      <span className="ml-2 text-[10px] muted">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                    <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ========== COMPETITOR BENCHMARK ========== */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5">
          <div className="eyebrow mb-1">Competitor benchmark · anonymized</div>
          <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            How you compare in {MOCK_BUSINESS.city}
          </h2>
          <p className="mt-1 text-xs muted">
            Same niche, same city. Names hidden to comply with our independence policy — upgrade to Featured to identify competitors directly.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 text-[10px] uppercase tracking-wider dark:border-ink-800">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-ink-600 dark:text-ink-400">Property</th>
                <th className="px-3 py-2 text-right font-bold text-ink-600 dark:text-ink-400">Trust</th>
                <th className="px-3 py-2 text-right font-bold text-ink-600 dark:text-ink-400">Inquiries 30d</th>
                <th className="px-3 py-2 text-right font-bold text-ink-600 dark:text-ink-400">Avg reply</th>
                <th className="px-3 py-2 text-center font-bold text-ink-600 dark:text-ink-400">Halal signal</th>
                <th className="px-3 py-2 text-center font-bold text-ink-600 dark:text-ink-400">Partnership</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {/* YOU row */}
              <tr className="bg-islam-50/60 dark:bg-islam-950/30">
                <td className="px-3 py-3 font-bold text-islam-950 dark:text-islam-50">
                  ⭐ You · {MOCK_BUSINESS.name}
                </td>
                <td className="px-3 py-3 text-right font-display text-lg font-bold tabular-nums text-islam-700 dark:text-islam-300">{MOCK_BUSINESS.trust_score}</td>
                <td className="px-3 py-3 text-right font-bold tabular-nums">446</td>
                <td className="px-3 py-3 text-right font-bold tabular-nums">42 min</td>
                <td className="px-3 py-3 text-center text-islam-700 dark:text-islam-300">✓</td>
                <td className="px-3 py-3 text-center muted">—</td>
              </tr>
              {MOCK_COMPETITORS.map((c, i) => (
                <tr key={i} className="transition hover:bg-sand-50/40 dark:hover:bg-ink-800/40">
                  <td className="px-3 py-3 text-ink-700 dark:text-ink-300">{c.anon}</td>
                  <td className="px-3 py-3 text-right font-bold tabular-nums">{c.trust_score}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.inquiries_30d}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{c.response_min} min</td>
                  <td className="px-3 py-3 text-center">{c.halal_signal ? <span className="text-islam-700 dark:text-islam-300">✓</span> : <span className="text-ink-400">—</span>}</td>
                  <td className="px-3 py-3 text-center">{c.partnership ? <span className="text-gold-700 dark:text-gold-400">Featured</span> : <span className="text-ink-400">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 rounded-xl bg-gold-50 px-4 py-3 text-xs text-gold-900 dark:bg-gold-950/30 dark:text-gold-200">
          <strong>Quick read:</strong> Your reply time (42 min) is the fastest in the city. Trust Score lead = 6 points over closest. One competitor is paying for Featured placement — see Billing to match.
        </div>
      </section>

      {/* ========== ACTIONABLE TIPS ========== */}
      <section>
        <div className="mb-4">
          <div className="eyebrow mb-1">Action items</div>
          <h2 className="h-display text-2xl font-bold text-islam-950 dark:text-islam-50">
            How to lift your score this week
          </h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {MOCK_TRUST_TIPS.map((tip) => (
            <li key={tip.title} className="card-editorial p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="rounded-md bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gold-800 dark:bg-gold-950/40 dark:text-gold-300">
                  {tip.impact}
                </span>
              </div>
              <h3 className="mt-3 font-display text-base font-bold text-islam-950 dark:text-islam-50">
                {tip.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-700 dark:text-ink-300">{tip.body}</p>
              <button className="mt-4 rounded-md border border-islam-700 px-3 py-1 text-[11px] font-bold text-islam-700 hover:bg-islam-50 dark:border-islam-500 dark:text-islam-300">
                Start →
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
