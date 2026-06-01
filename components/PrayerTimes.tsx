// Prayer times widget — drops into the place detail aside and city wiki pages.
// Server component (async). Renders 6 salat times + current Hijri date + the
// next-prayer countdown. Gracefully hides when the city lookup fails.

import { getPrayerTimes, nextPrayer, type DailyTimings } from "@/lib/prayer-times";

interface Props {
  city: string;
  country?: string;
  compact?: boolean;     // narrow sidebar variant
}

const ORDER: { key: keyof DailyTimings; label: string; emoji: string }[] = [
  { key: "Fajr",    label: "Fajr",    emoji: "🌅" },
  { key: "Sunrise", label: "Sunrise", emoji: "☀️" },
  { key: "Dhuhr",   label: "Dhuhr",   emoji: "🕛" },
  { key: "Asr",     label: "Asr",     emoji: "🌇" },
  { key: "Maghrib", label: "Maghrib", emoji: "🌆" },
  { key: "Isha",    label: "Isha",    emoji: "🌙" },
];

export default async function PrayerTimes({ city, country = "Thailand", compact = false }: Props) {
  if (!city) return null;
  const data = await getPrayerTimes(city, country);
  if (!data) return null;

  const next = nextPrayer(data.timings);

  return (
    <section className={`relative overflow-hidden rounded-2xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 ${compact ? "p-4" : "p-5"} dark:border-islam-800/60 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/30`}>
      <div className="bg-islamic-stars absolute inset-0 opacity-25" aria-hidden="true" />
      <div className="relative">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
              Prayer times · {city}
            </div>
            <div className="mt-0.5 font-display text-base font-bold text-islam-950 dark:text-islam-50">
              {data.hijri_day} {data.hijri_month_en} {data.hijri_year}
              <span className="text-xs muted"> AH</span>
            </div>
          </div>
          {next && (
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest muted">Next</div>
              <div className="font-display text-sm font-bold text-islam-700 dark:text-islam-300">
                {next.name} · {Math.floor(next.in_min / 60)}h {next.in_min % 60}m
              </div>
            </div>
          )}
        </div>

        <ul className={`grid ${compact ? "grid-cols-3 gap-1.5" : "grid-cols-3 gap-2 sm:grid-cols-6"}`}>
          {ORDER.map(({ key, label, emoji }) => {
            const isNext = next?.name === key;
            return (
              <li
                key={key}
                className={`rounded-lg px-2 py-2 text-center text-xs ${
                  isNext
                    ? "bg-gradient-to-br from-gold-200 to-gold-100 ring-1 ring-gold-400 dark:from-gold-900/40 dark:to-gold-950/40"
                    : "bg-white/60 dark:bg-ink-900/50"
                }`}
              >
                <div className="text-base">{emoji}</div>
                <div className={`mt-0.5 text-[9px] font-bold uppercase tracking-wider ${isNext ? "text-gold-900 dark:text-gold-200" : "muted"}`}>
                  {label}
                </div>
                <div className={`mt-0.5 font-display text-sm font-bold tabular-nums ${isNext ? "text-islam-900 dark:text-islam-100" : "text-ink-800 dark:text-ink-200"}`}>
                  {data.timings[key]}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 text-[9px] muted">
          Method: {data.method} · powered by AlAdhan API
        </div>
      </div>
    </section>
  );
}
