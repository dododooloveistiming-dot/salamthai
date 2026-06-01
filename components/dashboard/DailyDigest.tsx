import Link from "next/link";
import type { DailyHighlight } from "@/lib/dashboard-mock";

const TONE_STYLE: Record<DailyHighlight["tone"], { border: string; bg: string; icon: string; chip: string }> = {
  urgent:    { border: "border-rose-300 dark:border-rose-700/60",   bg: "bg-rose-50/70 dark:bg-rose-950/20",   icon: "text-rose-700 dark:text-rose-300",   chip: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
  celebrate: { border: "border-gold-300 dark:border-gold-700/60",   bg: "bg-gold-50/70 dark:bg-gold-950/20",   icon: "text-gold-700 dark:text-gold-300",   chip: "bg-gold-100 text-gold-800 dark:bg-gold-950/40 dark:text-gold-300" },
  neutral:   { border: "border-islam-300 dark:border-islam-700/60", bg: "bg-islam-50/60 dark:bg-islam-950/20", icon: "text-islam-700 dark:text-islam-300", chip: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300" },
};

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return "Late night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

export default function DailyDigest({
  ownerFirstName,
  highlights,
  lang,
}: {
  ownerFirstName: string;
  highlights: DailyHighlight[];
  lang: string;
}) {
  const greeting = timeOfDayGreeting();
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });

  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-islam-950 via-islam-900 to-emerald-950 p-6 text-white shadow-lg sm:p-8"
      aria-label="Today's digest"
    >
      {/* Decorative pattern */}
      <div className="bg-islamic-stars pointer-events-none absolute inset-0 opacity-[0.10]" aria-hidden="true" />
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold-300/90">
              {today}
            </div>
            <h2 className="h-display mt-1 text-2xl font-bold sm:text-3xl">
              {greeting}, {ownerFirstName}.
            </h2>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold-300 backdrop-blur">
            ☪ Today's digest
          </span>
        </div>

        <p className="mt-2 text-sm text-white/75">
          Here's what needs your attention today.
        </p>

        <ol className="mt-6 space-y-3">
          {highlights.map((h, i) => {
            const s = TONE_STYLE[h.tone];
            return (
              <li
                key={i}
                className={`rounded-xl border bg-white/5 backdrop-blur ${s.border} animate-[fade-up_0.4s_ease-out_forwards] opacity-0`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <Link href={h.cta ? `/${lang}${h.cta.href}` : "#"} className="flex items-start gap-4 p-4 sm:p-5">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/95 text-xl text-islam-950`}>
                    {h.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-bold leading-tight">{h.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">{h.body}</p>
                    {h.cta && (
                      <span className={`mt-3 inline-block rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${s.chip}`}>
                        {h.cta.label} →
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
