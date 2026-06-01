import Link from "next/link";
import {
  MOCK_BUSINESS,
  MOCK_DAILY,
  MOCK_KPIS,
  MOCK_TRUST_BREAKDOWN,
  MOCK_DAILY_DIGEST,
  MOCK_AI_INSIGHTS,
  MOCK_STREAKS,
  MOCK_ACTIVITY,
  MOCK_TODAY_VS_YESTERDAY as TODAY,
} from "@/lib/dashboard-mock";
import TrustGauge from "@/components/TrustGauge";
import DailyDigest from "@/components/dashboard/DailyDigest";
import AIInsightCard from "@/components/dashboard/AIInsightCard";
import StreakBadges from "@/components/dashboard/StreakBadges";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import type { Lang } from "@/lib/types";

export default function DashboardHome({ params }: { params: { lang: Lang } }) {
  const { lang } = params;
  const base = `/${lang}/dashboard`;

  const pctChange = (cur: number, prev: number) => ((cur - prev) / prev) * 100;
  const firstName = MOCK_BUSINESS.name.split(" ")[0];

  // Chart data
  const inqMax = Math.max(...MOCK_DAILY.map((d) => d.inquiries));
  const inqPoints = MOCK_DAILY.map((d, i) => {
    const x = (i / (MOCK_DAILY.length - 1)) * 100;
    const y = 32 - (d.inquiries / inqMax) * 30;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const viewMax = Math.max(...MOCK_DAILY.map((d) => d.views));
  const viewPoints = MOCK_DAILY.map((d, i) => {
    const x = (i / (MOCK_DAILY.length - 1)) * 100;
    const y = 32 - (d.views / viewMax) * 30;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");

  const streaks = [
    { label: "SLA streak",        value: MOCK_STREAKS.reply_under_1h_days,           unit: "days",   emoji: "🔥", tone: "fire" as const   },
    { label: "Top in city",       value: MOCK_STREAKS.trust_top_1_city_months,       unit: "months", emoji: "🏆", tone: "trophy" as const },
    { label: "Lifetime inquiries", value: MOCK_STREAKS.inquiries_total_lifetime.toLocaleString(), unit: "all-time", emoji: "✉",  tone: "diamond" as const },
    { label: "Lifetime bookings", value: MOCK_STREAKS.bookings_total_lifetime,       unit: "all-time", emoji: "✓",  tone: "diamond" as const },
  ];

  const todayCompares = [
    { label: "Inquiries",         today: TODAY.inquiries_today,            yesterday: TODAY.inquiries_yesterday },
    { label: "Bookings",          today: TODAY.bookings_today,             yesterday: TODAY.bookings_yesterday },
    { label: "Views",             today: TODAY.views_today,                yesterday: TODAY.views_yesterday },
    { label: "Replies < 1h",      today: TODAY.replies_within_1h_today,    yesterday: TODAY.replies_within_1h_yesterday },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-0">
      {/* ═══════════════ DAILY DIGEST HERO ═══════════════ */}
      <DailyDigest ownerFirstName={firstName} highlights={MOCK_DAILY_DIGEST} lang={lang} />

      {/* ═══════════════ STREAK BADGES ═══════════════ */}
      <StreakBadges streaks={streaks} />

      {/* ═══════════════ TODAY VS YESTERDAY (compact) ═══════════════ */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="eyebrow mb-0.5">Today vs yesterday</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              How today is going
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {todayCompares.map((c) => {
            const change = c.today - c.yesterday;
            const up = change >= 0;
            return (
              <div key={c.label} className="card-editorial p-4">
                <div className="eyebrow !text-[10px]">{c.label}</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
                    {c.today}
                  </span>
                  <span className={`text-[10px] font-bold ${up ? "text-islam-700 dark:text-islam-300" : "text-rose-600 dark:text-rose-400"}`}>
                    {up ? "▲" : "▼"} {Math.abs(change)}
                  </span>
                </div>
                <div className="text-[10px] muted">vs {c.yesterday} yesterday</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ KPI ROW (30 day) ═══════════════ */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="eyebrow mb-0.5">Last 30 days</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              Headline numbers
            </h2>
          </div>
          <Link href={`${base}/insights`} className="link-gold text-xs font-bold text-islam-700 dark:text-islam-300">
            Full insights →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[
            { label: "Inquiries",   value: MOCK_KPIS.inquiries_30d, prev: MOCK_KPIS.inquiries_prev_30d, fmt: (v: number) => v.toLocaleString() },
            { label: "Bookings",    value: MOCK_KPIS.bookings_30d,  prev: MOCK_KPIS.bookings_prev_30d,  fmt: (v: number) => v.toLocaleString() },
            { label: "Conversion",  value: MOCK_KPIS.conversion_pct, prev: MOCK_KPIS.conversion_prev_pct, fmt: (v: number) => `${v.toFixed(1)}%` },
            { label: "Revenue",     value: MOCK_KPIS.revenue_thb,   prev: MOCK_KPIS.revenue_prev_thb,   fmt: (v: number) => `฿${(v/1000).toFixed(0)}K` },
          ].map((k) => {
            const change = pctChange(k.value, k.prev);
            const up = change >= 0;
            return (
              <div key={k.label} className="card-editorial p-5">
                <div className="eyebrow !text-[10px]">{k.label}</div>
                <div className="mt-1 font-display text-3xl font-bold tabular-nums text-islam-950 dark:text-islam-50 sm:text-4xl">
                  {k.fmt(k.value)}
                </div>
                <div className={`mt-1 text-[11px] font-bold ${up ? "text-islam-700 dark:text-islam-300" : "text-rose-600 dark:text-rose-400"}`}>
                  {up ? "▲" : "▼"} {Math.abs(change).toFixed(1)}% vs prev 30d
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ CHART + TRUST + ACTIVITY (3-col on lg) ═══════════════ */}
      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr] xl:grid-cols-[1.4fr_1fr_1fr]">
        {/* 30-day chart */}
        <div className="card-editorial p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <div className="eyebrow mb-1">Activity · 30 days</div>
              <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
                Daily views & inquiries
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-islam-600" />Inquiries</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-3 rounded-sm bg-gold-500" />Views ÷10</span>
            </div>
          </div>

          <div className="mt-5">
            <svg viewBox="0 0 100 34" className="block w-full" preserveAspectRatio="none" style={{ height: 180 }}>
              <line x1="0" y1="32" x2="100" y2="32" stroke="currentColor" strokeWidth="0.2" className="text-ink-200 dark:text-ink-700" />
              <polyline fill="rgba(212, 175, 55, 0.15)" stroke="none" points={`0,32 ${viewPoints} 100,32`} />
              <polyline fill="none" stroke="#b88c1d" strokeWidth="0.4" strokeLinejoin="round" points={viewPoints} />
              <polyline fill="none" stroke="#047857" strokeWidth="0.6" strokeLinejoin="round" strokeLinecap="round" points={inqPoints} />
              {(() => {
                const lastY = 32 - (MOCK_DAILY[MOCK_DAILY.length - 1].inquiries / inqMax) * 30;
                return <circle cx="100" cy={lastY} r="0.8" fill="#047857" />;
              })()}
            </svg>
            <div className="mt-2 flex justify-between text-[9px] text-ink-400">
              <span>{MOCK_DAILY[0].date}</span>
              <span>{MOCK_DAILY[Math.floor(MOCK_DAILY.length / 2)].date}</span>
              <span>{MOCK_DAILY[MOCK_DAILY.length - 1].date}</span>
            </div>
          </div>
        </div>

        {/* Trust Gauge */}
        <div className="card-editorial flex flex-col items-center p-5">
          <div className="self-start">
            <div className="eyebrow mb-1">Trust Score</div>
            <div className="text-[10px] muted">Rank #{MOCK_BUSINESS.rank_in_city} of {MOCK_BUSINESS.total_in_city} in city</div>
          </div>
          <div className="mt-4">
            <TrustGauge score={MOCK_BUSINESS.trust_score} size={140} />
          </div>
          <Link
            href={`${base}/insights`}
            className="mt-4 w-full rounded-md border border-gold-400 bg-gold-50 px-3 py-2 text-center text-xs font-bold text-gold-900 hover:bg-gold-100 dark:bg-gold-950/30 dark:text-gold-200"
          >
            See breakdown →
          </Link>
        </div>

        {/* Live activity */}
        <div className="xl:row-span-1">
          <ActivityFeed events={MOCK_ACTIVITY} />
        </div>
      </section>

      {/* ═══════════════ AI INSIGHTS ═══════════════ */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <div>
            <div className="eyebrow mb-0.5">⚡ AI insights</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              What we noticed this week
            </h2>
          </div>
          <span className="text-[10px] uppercase tracking-wider muted">Updated daily</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {MOCK_AI_INSIGHTS.map((insight, i) => (
            <div key={i} className="animate-[fade-up_0.5s_ease-out_forwards] opacity-0" style={{ animationDelay: `${i * 0.06}s` }}>
              <AIInsightCard insight={insight} />
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ TRUST BREAKDOWN BARS ═══════════════ */}
      <section className="card-editorial p-5 sm:p-6">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <div className="eyebrow mb-1">Trust Score · components</div>
            <h2 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
              Where your {MOCK_BUSINESS.trust_score} points come from
            </h2>
          </div>
          <Link href={`${base}/insights`} className="link-gold text-xs font-bold text-islam-700 dark:text-islam-300">
            Detail →
          </Link>
        </div>

        <ul className="space-y-3">
          {MOCK_TRUST_BREAKDOWN.map((b, i) => {
            const pct = Math.round((b.earned / b.max) * 100);
            const barColor = b.color === "islam" ? "bg-islam-600 dark:bg-islam-500" : "bg-gold-500 dark:bg-gold-400";
            return (
              <li key={b.label} className="animate-[fade-up_0.4s_ease-out_forwards] opacity-0" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="mb-1 flex items-baseline justify-between text-xs">
                  <span className="font-medium text-ink-800 dark:text-ink-200">{b.label}</span>
                  <span className="font-bold tabular-nums text-islam-900 dark:text-islam-100">
                    {b.earned} <span className="text-[10px] muted">/ {b.max}</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800">
                  <div className={`h-full transition-[width] duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
