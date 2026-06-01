// Common 2-column shell for /wiki/niche, /wiki/city, /wiki/topic articles.
// Left column: WikiHeader + numbered sections + References + SeeAlso.
// Right column: sticky Infobox + optional related-list / quick stats.
//
// Pure shell — no data. Pages pass children + asideContent.

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  aside: ReactNode;
}

export default function WikiLayout({ children, aside }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="grid gap-10 pt-8 lg:grid-cols-[1fr_320px]">
        <article className="min-w-0">{children}</article>
        <aside className="lg:sticky lg:top-20 lg:self-start">{aside}</aside>
      </div>
    </main>
  );
}
