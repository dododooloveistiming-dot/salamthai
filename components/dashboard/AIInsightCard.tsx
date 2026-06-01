import type { AIInsight } from "@/lib/dashboard-mock";

const CAT_STYLE: Record<AIInsight["category"], { label: string; cls: string }> = {
  trend:       { label: "Trend",       cls: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300" },
  competitor:  { label: "Competitor",  cls: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
  opportunity: { label: "Opportunity", cls: "bg-gold-100 text-gold-800 dark:bg-gold-950/40 dark:text-gold-300" },
  warning:     { label: "Warning",     cls: "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300" },
};

export default function AIInsightCard({ insight }: { insight: AIInsight }) {
  const s = CAT_STYLE[insight.category];
  return (
    <article className="card-editorial relative overflow-hidden p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{insight.emoji}</span>
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${s.cls}`}>
            ⚡ AI · {s.label}
          </span>
        </div>
        {insight.metric && (
          <span className="font-display text-sm font-bold tabular-nums text-gold-700 dark:text-gold-400">
            {insight.metric}
          </span>
        )}
      </div>

      <h3 className="mt-3 font-display text-base font-bold leading-tight text-islam-950 dark:text-islam-50 sm:text-lg">
        {insight.title}
      </h3>
      <p className="mt-2 text-xs leading-relaxed text-ink-700 dark:text-ink-300">
        {insight.body}
      </p>
    </article>
  );
}
