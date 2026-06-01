// Info-poster card placeholder — designed to replace bare photos with rich,
// scannable data so users can judge a place at a glance without imagery.
//
// Layers (back to front):
//   1. Niche-themed gradient (every niche has its own palette).
//   2. Islamic 8-pointed star geometric pattern (SVG, low opacity).
//   3. Magazine-style large initial letter of the place name.
//   4. Trust score donut (top-right) + source coverage dots (●●●●○○).
//   5. Halal signal & language pill row across the bottom.
//
// The card is the "photo" replacement in every grid that used to fall back to
// emoji. It now communicates Trust / Halal verification / Language coverage
// in the same real estate.

import type { Niche } from "@/lib/types";

interface Theme {
  bg: string;
  bgDark: string;
  letter: string;
  pattern: string;
  emoji: string;
  donutRing: string;
  donutBg: string;
}

const THEMES: Record<string, Theme> = {
  "halal-food":       { bg: "from-orange-50 via-amber-100 to-rose-100",       bgDark: "from-orange-950/40 via-amber-950/40 to-rose-950/40",       letter: "text-orange-900/60",   pattern: "#c2410c", emoji: "🥘", donutRing: "stroke-orange-700",  donutBg: "stroke-orange-200" },
  "muslim-hotel":     { bg: "from-sky-50 via-indigo-100 to-purple-100",       bgDark: "from-sky-950/40 via-indigo-950/40 to-purple-950/40",       letter: "text-indigo-900/60",   pattern: "#312e81", emoji: "🏨", donutRing: "stroke-indigo-700",  donutBg: "stroke-indigo-200" },
  "halal-tour":       { bg: "from-teal-50 via-cyan-100 to-blue-100",          bgDark: "from-teal-950/40 via-cyan-950/40 to-blue-950/40",          letter: "text-cyan-900/60",     pattern: "#155e75", emoji: "✈️", donutRing: "stroke-cyan-700",    donutBg: "stroke-cyan-200" },
  "mosque":           { bg: "from-emerald-50 via-emerald-100 to-yellow-50",   bgDark: "from-emerald-950/40 via-emerald-900/40 to-yellow-950/40",  letter: "text-emerald-900/60", pattern: "#065f46", emoji: "🕌", donutRing: "stroke-emerald-700", donutBg: "stroke-emerald-200" },
  "halal-clinic":     { bg: "from-rose-50 via-pink-100 to-fuchsia-100",       bgDark: "from-rose-950/40 via-pink-950/40 to-fuchsia-950/40",       letter: "text-rose-900/60",     pattern: "#9f1239", emoji: "🏥", donutRing: "stroke-rose-700",    donutBg: "stroke-rose-200" },
  "halal-beauty":     { bg: "from-pink-50 via-rose-100 to-amber-50",          bgDark: "from-pink-950/40 via-rose-950/40 to-amber-950/40",         letter: "text-pink-900/60",     pattern: "#9d174d", emoji: "💄", donutRing: "stroke-pink-700",    donutBg: "stroke-pink-200" },
};

const DEFAULT_THEME: Theme = {
  bg: "from-islam-50 via-sand-50 to-gold-50",
  bgDark: "from-islam-950/40 via-ink-900 to-gold-950/40",
  letter: "text-islam-900/60",
  pattern: "#166534",
  emoji: "☪",
  donutRing: "stroke-islam-700",
  donutBg: "stroke-islam-200",
};

function themeFor(niche: string): Theme {
  return THEMES[niche] ?? DEFAULT_THEME;
}

function initialOf(name: string): string {
  if (!name) return "?";
  const clean = name.replace(/^(The|Al|El|La|Le|Pa)\s+/i, "");
  const ch = clean.charAt(0).toUpperCase();
  return /[A-Z0-9ก-๙ا-يㄱ-힣]/.test(ch) ? ch : (name.charAt(0).toUpperCase() || "?");
}

function angleFor(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return ((h % 30) + 30) % 30;
}

// Parse the comma-separated halal_signals string into short readable labels.
const SIGNAL_LABEL: Record<string, string> = {
  CICOT: "CICOT",
  halal_certified: "Halal cert",
  halal_authority: "Halal cert",
  halal_kitchen: "Halal kitchen",
  prayer_room: "Prayer room",
  qibla: "Qibla",
  muslim_friendly: "Muslim-friendly",
  crescent_rated: "CR rated",
  female_doctor: "Female doctor",
  women_only: "Women only",
  hijab_friendly: "Hijab-friendly",
  TH_cert: "TH cert",
  TH_halal_mark: "Halal mark",
  TH_mosque: "Mosque",
  TH_prayer_room: "Prayer room",
  AR_cert: "AR cert",
  AR_prayer_room: "Prayer room",
  AR_mosque: "Mosque",
  MUI_cert: "MUI cert",
  MS_cert: "MS cert",
  KO_cert: "Halal cert",
  KO_prayer_room: "Prayer room",
};

function pickSignals(detected?: string, max = 3): string[] {
  if (!detected) return [];
  const raw = detected.split(",").map((s) => s.trim()).filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of raw) {
    const lbl = SIGNAL_LABEL[s] ?? s.replace(/_/g, " ");
    if (!seen.has(lbl)) {
      seen.add(lbl);
      out.push(lbl);
      if (out.length >= max) break;
    }
  }
  return out;
}

interface Props {
  niche: Niche | string;
  name: string;
  slug?: string;
  /** Photo URL is currently ignored — placeholder always wins for visual consistency. */
  photoUrl?: string | null;
  trustScore?: number;
  sourceCount?: number;        // 0..8
  halalSignals?: string;       // comma list
  languages?: { ko?: boolean; ar?: boolean; ja?: boolean; zh?: boolean; th?: boolean };
  className?: string;
  rounded?: string;
}

const FLAG: Record<string, string> = { ko: "🇰🇷", ar: "🇸🇦", ja: "🇯🇵", zh: "🇨🇳", th: "🇹🇭" };

export default function PlacePhoto({
  niche,
  name,
  slug,
  trustScore,
  sourceCount = 0,
  halalSignals,
  languages,
  className = "aspect-[4/3]",
  rounded = "rounded-2xl",
}: Props) {
  const t = themeFor(niche);
  const seed = slug || name || "x";
  const ang = angleFor(seed);
  const initial = initialOf(name);
  const signals = pickSignals(halalSignals, 3);

  // donut ring: 36 px radius for a 100x100 viewBox — keep math simple.
  const trustPct = Math.max(0, Math.min(100, trustScore ?? 0));
  const R = 36;
  const C = 2 * Math.PI * R;
  const donutDash = `${(trustPct / 100) * C} ${C}`;

  const langCodes = languages
    ? (["ar", "ko", "ja", "zh"] as const).filter((k) => languages[k])
    : [];

  return (
    <div className={`${rounded} relative overflow-hidden bg-gradient-to-br ${t.bg} dark:${t.bgDark} ${className}`} aria-hidden="true">
      {/* Layer 2 — Islamic geometric pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18] mix-blend-multiply dark:mix-blend-screen dark:opacity-[0.12]"
        style={{ transform: `rotate(${ang}deg) scale(1.4)` }}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id={`stars-${seed}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M8 1 L10.1 5.9 L15 8 L10.1 10.1 L8 15 L5.9 10.1 L1 8 L5.9 5.9 Z"
              fill="none"
              stroke={t.pattern}
              strokeWidth="0.6"
              opacity="0.7"
            />
            <circle cx="8" cy="8" r="1.2" fill={t.pattern} opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#stars-${seed})`} />
      </svg>

      {/* Layer 3 — Big initial letter (center) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`font-display text-[7rem] font-black leading-none ${t.letter} drop-shadow-sm sm:text-[8rem]`}
          style={{ letterSpacing: "-0.05em" }}
        >
          {initial}
        </span>
      </div>

      {/* Layer 4a — Trust donut (top-right) */}
      {trustScore != null && trustScore > 0 && (
        <div className="absolute right-2 top-2">
          <svg width="56" height="56" viewBox="0 0 100 100" className="drop-shadow-sm">
            <circle cx="50" cy="50" r={R} fill="white" className="opacity-90 dark:fill-ink-900" />
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              strokeWidth="8"
              className={t.donutBg}
              opacity="0.4"
            />
            <circle
              cx="50" cy="50" r={R}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={donutDash}
              transform="rotate(-90 50 50)"
              className={t.donutRing}
            />
            <text
              x="50" y="58"
              textAnchor="middle"
              className="fill-islam-950 dark:fill-islam-50 font-display font-black"
              style={{ fontSize: 32 }}
            >
              {trustScore}
            </text>
          </svg>
        </div>
      )}

      {/* Layer 4b — Source coverage dots (top-left) */}
      {sourceCount > 0 && (
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 shadow-sm backdrop-blur dark:bg-ink-900/85">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className={`block h-1.5 w-1.5 rounded-full ${i < sourceCount ? "bg-islam-700 dark:bg-islam-300" : "bg-ink-200 dark:bg-ink-700"}`}
            />
          ))}
          <span className="ml-1 text-[9px] font-bold uppercase tracking-widest text-ink-700 dark:text-ink-300">
            {Math.min(6, sourceCount)}/6
          </span>
        </div>
      )}

      {/* Layer 5 — Bottom pill row (halal signals + languages + emoji anchor) */}
      <div className="absolute inset-x-2 bottom-2 flex flex-wrap items-center gap-1">
        {signals.slice(0, 2).map((s) => (
          <span
            key={s}
            className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-islam-800 shadow-sm backdrop-blur dark:bg-ink-900/85 dark:text-islam-200"
          >
            ✓ {s}
          </span>
        ))}
        {langCodes.length > 0 && (
          <span className="rounded-full bg-white/85 px-1.5 py-0.5 text-[11px] shadow-sm backdrop-blur dark:bg-ink-900/85">
            {langCodes.map((c) => FLAG[c]).join(" ")}
          </span>
        )}
        <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-white/85 text-base shadow-sm backdrop-blur dark:bg-ink-900/85">
          {t.emoji}
        </span>
      </div>
    </div>
  );
}
