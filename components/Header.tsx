"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang, Niche } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";
import { SITE, SUPPORTED_LANGS } from "@/lib/i18n";
import DarkModeToggle from "./DarkModeToggle";

const ALL_NICHES: Niche[] = [
  "halal-food", "muslim-hotel", "halal-tour", "mosque", "halal-clinic", "halal-beauty",
];

const LANG_LABEL: Record<Lang, string> = {
  en: "English", ko: "한국어", th: "ไทย", zh: "中文", ja: "日本語", ar: "العربية",
};

export default function Header({ lang, byNiche }: { lang: Lang; byNiche?: Record<Niche, number> }) {
  const [open, setOpen] = useState(false);

  const navNiches = byNiche
    ? ALL_NICHES.filter((n) => (byNiche[n] ?? 0) > 0)
    : ALL_NICHES;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-islam-100 bg-white/90 backdrop-blur dark:border-islam-800/60 dark:bg-ink-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        {/* Logo */}
        <Link
          href={`/${lang}/`}
          className="flex items-center gap-2 font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-islam-700 to-islam-950 text-gold-400 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </span>
          <span className="font-display text-sm text-islam-950 dark:text-islam-100 sm:text-base">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop nav — niches */}
        <nav className="hidden flex-1 items-center gap-3 overflow-x-auto px-4 text-xs font-medium md:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navNiches.map((n) => (
            <Link
              key={n}
              href={`/${lang}/c/${n}/`}
              className="whitespace-nowrap text-ink-700 transition hover:text-islam-700 dark:text-ink-300 dark:hover:text-islam-200"
            >
              {NICHE_META[n].emoji} {nicheName(n, lang)}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          {/* Search icon link */}
          <Link
            href={`/${lang}/search/`}
            className="hidden h-8 w-8 place-items-center rounded-md border border-ink-200 text-ink-700 transition hover:border-gold-400 hover:bg-gold-50 hover:text-gold-900 dark:border-ink-700 dark:text-ink-300 sm:grid"
            aria-label="Search"
            title="Search verified places"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          {/* For Business — primary CTA */}
          <Link
            href={`/${lang}/for-business/`}
            className="hidden h-8 items-center rounded-md bg-gradient-to-br from-gold-500 to-gold-700 px-3 text-xs font-bold text-islam-950 shadow-sm transition hover:from-gold-400 hover:to-gold-600 sm:inline-flex"
            title="Are you a halal business?"
          >
            For Business →
          </Link>

          {/* Lang select (compact) */}
          <select
            value={lang}
            onChange={(e) => { window.location.href = `/${e.target.value}/`; }}
            className="hidden h-8 rounded-md border border-ink-200 bg-transparent px-2 text-xs font-semibold lg:block dark:border-ink-700"
            aria-label="Language"
          >
            {SUPPORTED_LANGS.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>

          <DarkModeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-ink-200 transition hover:bg-ink-100 dark:border-ink-700 dark:hover:bg-ink-800 md:hidden"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-14 z-30 bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <nav
        className={`fixed inset-x-0 top-14 z-40 max-h-[calc(100vh-3.5rem)] origin-top overflow-y-auto border-b border-ink-100 bg-white shadow-2xl transition-transform duration-200 ease-out dark:border-ink-800 dark:bg-ink-950 md:hidden ${
          open ? "translate-y-0" : "pointer-events-none -translate-y-2 opacity-0"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {/* Primary actions */}
        <div className="border-b border-ink-100 p-4 dark:border-ink-800">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${lang}/search/`}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl border border-islam-300 bg-white text-sm font-bold text-islam-900 transition active:scale-[0.97] dark:border-islam-700 dark:bg-ink-900 dark:text-islam-100"
            >
              <span aria-hidden="true">🔍</span> Search
            </Link>
            <Link
              href={`/${lang}/for-business/`}
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 text-sm font-bold text-islam-950 shadow-sm transition active:scale-[0.97]"
            >
              🏢 For Business
            </Link>
          </div>
        </div>

        {/* Niche grid */}
        <ul className="grid grid-cols-2 gap-2 p-4">
          {navNiches.map((n) => (
            <li key={n}>
              <Link
                href={`/${lang}/c/${n}/`}
                onClick={() => setOpen(false)}
                className="flex min-h-[64px] items-center gap-3 rounded-xl border border-islam-100 bg-gradient-to-br from-sand-50/60 to-white px-3 py-3 text-sm font-medium transition hover:border-gold-400 hover:shadow-sm active:scale-[0.97] dark:border-islam-800/40 dark:from-ink-900 dark:to-ink-900"
              >
                <span className="text-2xl">{NICHE_META[n].emoji}</span>
                <span className="leading-tight">{nicheName(n, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Secondary */}
        <div className="border-t border-ink-100 grid grid-cols-2 gap-2 p-4 text-xs dark:border-ink-800">
          <Link
            href={`/${lang}/why-us/`}
            onClick={() => setOpen(false)}
            className="rounded-md border border-ink-200 px-3 py-2.5 text-center font-medium text-ink-700 transition active:scale-[0.97] dark:border-ink-700 dark:text-ink-300"
          >
            Why us
          </Link>
          <Link
            href={`/${lang}/about/`}
            onClick={() => setOpen(false)}
            className="rounded-md border border-ink-200 px-3 py-2.5 text-center font-medium text-ink-700 transition active:scale-[0.97] dark:border-ink-700 dark:text-ink-300"
          >
            About
          </Link>
        </div>

        {/* Language */}
        <div className="border-t border-ink-100 px-4 py-3 dark:border-ink-800">
          <div className="muted mb-2 text-xs">Language</div>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_LANGS.map((l) => (
              <a
                key={l}
                href={`/${l}/`}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                  l === lang
                    ? "border-islam-500 bg-islam-50 text-islam-700 dark:bg-islam-950/40 dark:text-islam-300"
                    : "muted border-ink-200 dark:border-ink-700"
                }`}
              >
                {LANG_LABEL[l]}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
