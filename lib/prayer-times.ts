// Prayer times helper — fetches daily salat timings for a given city via
// AlAdhan's free API. We cache per-city per-day in module-level memory so
// concurrent requests (e.g. multiple place pages in one build) hit the
// network only once per city.
//
// Used by <PrayerTimes/> on place detail pages + future /wiki/city/ pages.
// No API key required. Polite rate (one fetch per city per day max).
//
// Method 2 (ISNA) chosen as a sensible default for Thailand — close to what
// most local mosques publish. Can be overridden per city later.

export interface DailyTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerData {
  city: string;
  date_gregorian: string;
  date_hijri: string;
  hijri_day: string;
  hijri_month_en: string;
  hijri_year: string;
  timings: DailyTimings;
  method: string;
}

const cache = new Map<string, { day: string; data: PrayerData | null }>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getPrayerTimes(city: string, country = "Thailand"): Promise<PrayerData | null> {
  const key = `${city.toLowerCase()}|${country.toLowerCase()}`;
  const day = today();
  const hit = cache.get(key);
  if (hit && hit.day === day) return hit.data;

  try {
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
    const r = await fetch(url, {
      headers: { "User-Agent": "salaamthailand.com" },
      next: { revalidate: 60 * 60 * 12 },  // 12h ISR cache on top of in-memory
    });
    if (!r.ok) {
      cache.set(key, { day, data: null });
      return null;
    }
    const j = await r.json();
    if (j?.code !== 200 || !j?.data?.timings) {
      cache.set(key, { day, data: null });
      return null;
    }
    const t = j.data.timings;
    const data: PrayerData = {
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
    cache.set(key, { day, data });
    return data;
  } catch {
    cache.set(key, { day, data: null });
    return null;
  }
}

// Sunset is also informative for iftar planning during Ramadan.
export function nextPrayer(timings: DailyTimings, now = new Date()): { name: keyof DailyTimings; in_min: number } | null {
  const order: (keyof DailyTimings)[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  for (const name of order) {
    const [h, m] = timings[name].split(":").map(Number);
    const total = h * 60 + m;
    if (total > minutesNow) return { name, in_min: total - minutesNow };
  }
  return null;  // Past Isha — next is Fajr tomorrow; UI can show "tomorrow's Fajr"
}
