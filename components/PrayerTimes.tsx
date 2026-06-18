"use client";

// Prayer times widget — drops into the place detail aside and city wiki pages.
//
// CLIENT component: fetches daily salat times from AlAdhan's free public API
// (CORS-enabled) on mount, so the host page stays fully STATIC. Previously this
// was an async server component, which forced the place/wiki pages onto a 12h
// `revalidate` cycle — every crawler hit past the window triggered a background
// ISR write, and ~4,800 place pages × 6 langs blew past Vercel's ISR-write
// quota. Fetching client-side removes that churn entirely and, as a bonus,
// makes the "next prayer" countdown actually live instead of frozen at build.

import { useEffect, useState } from "react";
import { nextPrayer, type DailyTimings, type PrayerData } from "@/lib/prayer-times";

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

async function fetchPrayerTimes(city: string, country: string): Promise<PrayerData | null> {
  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const j = await r.json();
    if (j?.code !== 200 || !j?.data?.timings) return null;
    const t = j.data.timings;
    return {
      city,
      date_gregorian: j.data.date.gregorian.date,
      date_hijri: j.data.date.hijri.date,
      hijri_day: j.data.date.hijri.day,
      hijri_month_en: j.data.date.hijri.month.en,
      hijri_year: j.data.date.hijri.year,
      timings: {
        Fajr: t.Fajr, Sunrise: t.Sunrise, Dhuhr: t.Dhuhr,
        Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha,
      },
      method: j.data.meta.method.name,
    };
  } catch {
    return null;
  }
}

export default function PrayerTimes({ city, country = "Thailand", compact = false }: Props) {
  const [data, setData] = useState<PrayerData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  // tick re-renders the live "next prayer" countdown each minute.
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!city) {
      setState("error");
      return;
    }
    let alive = true;
    fetchPrayerTimes(city, country).then((d) => {
      if (!alive) return;
      if (d) {
        setData(d);
        setState("ready");
      } else {
        setState("error");
      }
    });
    return () => {
      alive = false;
    };
  }, [city, country]);

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Gracefully hide when the city lookup fails — matches prior server behavior.
  if (state === "error" || !city) return null;

  const shellClass = `relative overflow-hidden rounded-2xl border border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 ${compact ? "p-4" : "p-5"} dark:border-islam-800/60 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/30`;

  if (state === "loading" || !data) {
    // Lightweight skeleton so the sidebar doesn't jump while AlAdhan responds.
    return (
      <section className={shellClass} aria-busy="true">
        <div className="bg-islamic-stars absolute inset-0 opacity-25" aria-hidden="true" />
        <div className="relative animate-pulse">
          <div className="mb-3 h-4 w-1/2 rounded bg-islam-200/60 dark:bg-islam-800/60" />
          <div className={`grid ${compact ? "grid-cols-3 gap-1.5" : "grid-cols-3 gap-2 sm:grid-cols-6"}`}>
            {ORDER.map(({ key }) => (
              <div key={key} className="h-14 rounded-lg bg-white/60 dark:bg-ink-900/50" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const next = nextPrayer(data.timings);

  return (
    <section className={shellClass}>
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
