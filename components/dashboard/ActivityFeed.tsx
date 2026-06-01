import type { ActivityEvent } from "@/lib/dashboard-mock";

const TYPE_DOT: Record<ActivityEvent["type"], string> = {
  inquiry: "bg-rose-500",
  review:  "bg-gold-500",
  booking: "bg-islam-600",
  trust:   "bg-islam-700",
  view:    "bg-ink-400",
};

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  return (
    <div className="card-editorial overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink-100 p-4 dark:border-ink-800">
        <div>
          <div className="eyebrow !text-[10px]">Live</div>
          <h3 className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
            Activity feed
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-islam-700 dark:text-islam-300">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-islam-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-islam-500" />
          </span>
          Live
        </span>
      </div>

      <ol className="max-h-[420px] overflow-y-auto">
        {events.map((e, i) => (
          <li
            key={i}
            className="flex gap-3 border-b border-ink-100 px-4 py-3 last:border-b-0 dark:border-ink-800/60"
          >
            <div className="relative shrink-0">
              <div className={`mt-1.5 h-2 w-2 rounded-full ${TYPE_DOT[e.type]}`} />
              {i !== events.length - 1 && (
                <div className="absolute left-1/2 top-3 h-full w-px -translate-x-1/2 bg-ink-100 dark:bg-ink-800" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider muted">
                  {e.type}
                </span>
                <span className="text-[10px] muted">{e.ago}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-800 dark:text-ink-200">
                {e.emoji} {e.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
