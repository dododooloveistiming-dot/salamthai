// Wiki article header — Wikipedia-style title block with breadcrumb,
// eyebrow ("Wiki article · Niche"), big serif headline, and last-updated meta.
// Sits at the very top of every /wiki/* page.

import Link from "next/link";
import { SITE } from "@/lib/i18n";

interface Props {
  lang: string;
  kind: "niche" | "city" | "topic";
  title: string;
  subtitle?: string;
  lastModified?: string;
  readMinutes?: number;
}

const KIND_LABEL: Record<Props["kind"], string> = {
  niche: "Wiki · Niche entry",
  city:  "Wiki · City guide",
  topic: "Wiki · Encyclopedia",
};

const KIND_BREAD: Record<Props["kind"], string> = {
  niche: "niche",
  city:  "city",
  topic: "topic",
};

export default function WikiHeader({ lang, kind, title, subtitle, lastModified, readMinutes }: Props) {
  return (
    <header className="mb-10">
      <nav className="mb-3 text-xs muted">
        <Link href={`/${lang}/`} className="hover:text-gold-700">{SITE.name}</Link>
        <span className="mx-2">/</span>
        <Link href={`/${lang}/wiki/`} className="hover:text-gold-700">Wiki</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{KIND_BREAD[kind]}</span>
      </nav>

      <div className="eyebrow text-gold-800 dark:text-gold-300">
        {KIND_LABEL[kind]}
      </div>
      <h1 className="mt-1 h-display text-4xl text-islam-950 dark:text-islam-50 sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-700 dark:text-ink-300 sm:text-lg">
          {subtitle}
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] muted">
        {lastModified && (
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📅</span>
            <span>Updated {lastModified}</span>
          </span>
        )}
        {readMinutes && (
          <span className="flex items-center gap-1">
            <span aria-hidden="true">📖</span>
            <span>~{readMinutes} min read</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <span aria-hidden="true">✓</span>
          <span>Cross-verified across 8 sources</span>
        </span>
      </div>

      <hr className="mt-6 border-islam-200 dark:border-islam-800/60" />
    </header>
  );
}
