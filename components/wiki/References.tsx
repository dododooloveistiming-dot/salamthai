// References list — numbered footnotes at the bottom of a wiki article. Each
// citation pairs with a <Cite n={N}/> in the body. Footnotes link out, the
// inline citation jumps to the matching <li id="ref-N">.

import type { ReactNode } from "react";

export interface Reference {
  /** 1-based index used by <Cite n={i}/> in the article body */
  n: number;
  title: string;
  source?: string;          // e.g. "Reddit · r/MuslimTravels"
  url?: string;
  date?: string;            // ISO or human-readable
  note?: ReactNode;
}

interface Props {
  refs: Reference[];
  title?: string;
}

export default function References({ refs, title = "References" }: Props) {
  if (refs.length === 0) return null;
  return (
    <section className="mt-12" id="references">
      <h2 className="mb-4 flex items-baseline gap-3 font-display text-2xl font-bold text-islam-950 dark:text-islam-50">
        <span className="text-base font-bold text-gold-700 dark:text-gold-400">§</span>
        {title}
      </h2>
      <ol className="space-y-2 text-sm">
        {refs.map((r) => (
          <li
            id={`ref-${r.n}`}
            key={r.n}
            className="flex gap-3 rounded-md border-l-2 border-islam-200 px-3 py-1.5 dark:border-islam-800/40"
          >
            <span className="shrink-0 font-display text-xs font-bold text-gold-700 dark:text-gold-400">
              [{r.n}]
            </span>
            <div className="min-w-0 flex-1">
              {r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="nofollow noopener"
                  className="link-gold text-ink-800 hover:text-gold-800 dark:text-ink-200"
                >
                  {r.title}
                </a>
              ) : (
                <span className="text-ink-800 dark:text-ink-200">{r.title}</span>
              )}
              {(r.source || r.date) && (
                <div className="mt-0.5 text-[11px] muted">
                  {r.source}
                  {r.source && r.date && " · "}
                  {r.date}
                </div>
              )}
              {r.note && <div className="mt-1 text-xs muted">{r.note}</div>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Inline citation marker — drop in the body like:
//   <p>...halal kitchen verified <Cite n={1}/>.</p>
export function Cite({ n }: { n: number }) {
  return (
    <a
      href={`#ref-${n}`}
      className="ml-0.5 align-super text-[10px] font-bold text-gold-700 no-underline hover:text-gold-900 dark:text-gold-400"
    >
      [{n}]
    </a>
  );
}
