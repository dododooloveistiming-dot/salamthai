// "See also" cross-link block at the article footer. Wikipedia-style: bulleted
// list of related wiki entries. Keeps internal-linking deep so Googlebot
// follows the graph all the way to leaf articles.

import Link from "next/link";

export interface SeeAlsoItem {
  href: string;
  label: string;
  hint?: string;
}

interface Props {
  items: SeeAlsoItem[];
  title?: string;
}

export default function SeeAlso({ items, title = "See also" }: Props) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10" id="see-also">
      <h2 className="mb-3 flex items-baseline gap-3 font-display text-2xl font-bold text-islam-950 dark:text-islam-50">
        <span className="text-base font-bold text-gold-700 dark:text-gold-400">§</span>
        {title}
      </h2>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li key={it.href} className="flex items-baseline gap-2 text-sm">
            <span className="text-gold-700 dark:text-gold-400" aria-hidden="true">→</span>
            <Link
              href={it.href}
              className="link-gold text-islam-700 hover:text-gold-800 dark:text-islam-300"
            >
              {it.label}
            </Link>
            {it.hint && <span className="text-xs muted">— {it.hint}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
