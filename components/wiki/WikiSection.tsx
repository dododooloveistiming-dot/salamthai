// Numbered section heading + body wrapper — matches the Arabic-numeral motif
// already used on niche category pages so the wiki visual language stays
// consistent with the rest of the site.

import type { ReactNode } from "react";

interface Props {
  n: number;
  title: string;
  arabicNumeral?: string;
  children: ReactNode;
}

const AR_NUMERALS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩", "١٠", "١١", "١٢"];

export default function WikiSection({ n, title, arabicNumeral, children }: Props) {
  const ar = arabicNumeral ?? AR_NUMERALS[n] ?? String(n);
  return (
    <section className="mt-10" id={`section-${n}`}>
      <h2 className="mb-4 flex items-baseline gap-3 font-display text-2xl font-bold text-islam-950 dark:text-islam-50 sm:text-3xl">
        <span
          className="font-arabic text-xl text-islam-600 dark:text-islam-400 sm:text-2xl"
          dir="rtl"
          lang="ar"
          aria-hidden="true"
        >
          {ar}
        </span>
        <span>{title}</span>
      </h2>
      <div className="prose prose-sm max-w-none text-ink-800 dark:text-ink-200 sm:prose-base prose-headings:font-display prose-h3:text-lg prose-h3:font-bold prose-h3:text-islam-900 dark:prose-h3:text-islam-100 prose-a:link-gold prose-a:text-islam-700 dark:prose-a:text-islam-300 prose-li:my-0.5 prose-p:my-3">
        {children}
      </div>
    </section>
  );
}
