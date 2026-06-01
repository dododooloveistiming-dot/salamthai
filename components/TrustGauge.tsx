import type { ReactNode } from "react";

type Tier = "high" | "mid" | "low";

function tierOf(score: number): Tier {
  if (score >= 70) return "high";
  if (score >= 45) return "mid";
  return "low";
}

const TIER_COLOR: Record<Tier, string> = {
  high: "#047857", // islam-700
  mid:  "#b88c1d", // gold-600
  low:  "#e11d48", // rose-600
};

const TIER_LABEL: Record<Tier, string> = {
  high: "High trust",
  mid:  "Moderate",
  low:  "Low signal",
};

export default function TrustGauge({
  score,
  size = 128,
  showLabel = true,
}: {
  score: number;
  size?: number;
  showLabel?: boolean;
}) {
  const tier = tierOf(score);
  const color = TIER_COLOR[tier];
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {/* track */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-ink-150/70 dark:text-ink-800"
        />
        {/* progress */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="font-display text-3xl font-bold tabular-nums leading-none" style={{ color }}>
          {score}
        </div>
        <div className="text-[9px] font-bold uppercase tracking-widest muted">/ 100</div>
        {showLabel && (
          <div
            className="mt-1 text-[9px] font-bold uppercase tracking-wider"
            style={{ color }}
          >
            {TIER_LABEL[tier]}
          </div>
        )}
      </div>
    </div>
  );
}

export function TrustBadge({ score }: { score: number }): ReactNode {
  const tier = tierOf(score);
  const color = TIER_COLOR[tier];
  return (
    <span
      className="inline-flex items-baseline gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-black tabular-nums shadow-sm"
      style={{ backgroundColor: color, color: "white" }}
    >
      {score}
      <span className="text-[9px] font-semibold opacity-90">/100</span>
    </span>
  );
}
