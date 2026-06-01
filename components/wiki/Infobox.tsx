// Wikipedia-style infobox — the small right-column data table that anchors
// every wiki article. Rows are typed loosely (label + ReactNode value) so we
// can mix plain text, links, badges, and stats.

import Link from "next/link";
import type { ReactNode } from "react";

export interface InfoboxRow {
  label: string;
  value: ReactNode;
}

interface Props {
  title: string;
  subtitle?: string;
  emoji?: string;
  rows: InfoboxRow[];
  /** small footer like "Updated 2026-06-01" */
  footnote?: string;
  /** lazy CTA — e.g. link to category page */
  cta?: { label: string; href: string };
  /** "Sources verified: 6/8" small indicator */
  sourcesBadge?: ReactNode;
}

export default function Infobox({
  title,
  subtitle,
  emoji,
  rows,
  footnote,
  cta,
  sourcesBadge,
}: Props) {
  return (
    <aside className="card-editorial w-full overflow-hidden border-islam-200 dark:border-islam-800/60">
      {/* Header band — Wikipedia-style colored top */}
      <header className="border-b border-islam-200 bg-gradient-to-br from-islam-50 via-sand-50 to-gold-50 px-5 py-4 dark:border-islam-800/60 dark:from-islam-950/40 dark:via-ink-900 dark:to-gold-950/30">
        <div className="flex items-start gap-3">
          {emoji && (
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-islam-200 dark:bg-ink-900 dark:ring-islam-800/60">
              {emoji}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-gold-800 dark:text-gold-300">
              Wiki entry
            </div>
            <h2 className="mt-0.5 font-display text-lg font-bold leading-tight text-islam-950 dark:text-islam-50">
              {title}
            </h2>
            {subtitle && (
              <div className="mt-0.5 text-xs muted">{subtitle}</div>
            )}
          </div>
        </div>
      </header>

      {/* Rows */}
      <dl className="divide-y divide-islam-100 text-sm dark:divide-islam-800/40">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[110px_1fr] gap-3 px-5 py-2.5">
            <dt className="text-[10px] font-bold uppercase tracking-widest text-ink-600 dark:text-ink-400">
              {r.label}
            </dt>
            <dd className="break-words text-ink-800 dark:text-ink-200">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {(sourcesBadge || cta || footnote) && (
        <footer className="border-t border-islam-100 bg-sand-50/40 px-5 py-3 text-xs dark:border-islam-800/40 dark:bg-ink-900/60">
          {sourcesBadge && <div className="mb-2">{sourcesBadge}</div>}
          {cta && (
            <Link
              href={cta.href}
              className="link-gold inline-flex items-center gap-1 font-bold text-islam-700 dark:text-islam-300"
            >
              {cta.label} →
            </Link>
          )}
          {footnote && <div className="mt-2 text-[10px] muted">{footnote}</div>}
        </footer>
      )}
    </aside>
  );
}
