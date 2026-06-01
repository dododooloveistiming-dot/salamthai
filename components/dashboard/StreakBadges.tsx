import type { ReactNode } from "react";

interface Streak {
  label: string;
  value: ReactNode;
  unit: string;
  emoji: string;
  tone: "fire" | "trophy" | "diamond";
}

const TONE: Record<Streak["tone"], string> = {
  fire:    "from-rose-500 to-orange-600",
  trophy:  "from-gold-500 to-gold-700",
  diamond: "from-islam-600 to-emerald-700",
};

export default function StreakBadges({ streaks }: { streaks: Streak[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {streaks.map((s) => (
        <div key={s.label} className="card-editorial relative overflow-hidden p-4">
          <div
            className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br opacity-15 ${TONE[s.tone]}`}
            aria-hidden="true"
          />
          <div className="relative">
            <div className="text-2xl">{s.emoji}</div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">
                {s.value}
              </span>
              <span className="text-[10px] uppercase tracking-wider muted">{s.unit}</span>
            </div>
            <div className="mt-0.5 text-[10px] uppercase tracking-wider font-bold text-gold-700 dark:text-gold-400">
              {s.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
