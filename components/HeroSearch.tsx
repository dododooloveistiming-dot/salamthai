"use client";
import { useEffect, useMemo, useRef, useState } from "react";

interface Suggestion {
  label: string;
  href: string;
  icon: string;
}

const ALL_SUGGESTIONS: Suggestion[] = [
  { label: "Halal restaurants in Bangkok",   href: "/c/halal-food/?city=bangkok",        icon: "🥘" },
  { label: "Muslim-friendly hotels Phuket",  href: "/c/muslim-hotel/?city=phuket",       icon: "🏨" },
  { label: "Halal restaurants Phuket",       href: "/c/halal-food/?city=phuket",         icon: "🥘" },
  { label: "Krabi halal tour",               href: "/c/halal-tour/?city=krabi",          icon: "✈️" },
  { label: "Mosques in Bangkok",             href: "/c/mosque/?city=bangkok",            icon: "🕌" },
  { label: "Mosques in Phuket",              href: "/c/mosque/?city=phuket",             icon: "🕌" },
  { label: "Sukhumvit Soi 3 (Nana) halal",   href: "/c/halal-food/?city=bangkok",        icon: "🥘" },
  { label: "Indra Square halal market",      href: "/c/halal-food/?city=bangkok",        icon: "🥘" },
  { label: "Al Meroz Hotel",                 href: "/c/muslim-hotel/?city=bangkok",      icon: "🏨" },
  { label: "Iftar buffet Bangkok",           href: "/c/halal-food/?city=bangkok",        icon: "🥘" },
  { label: "Bumrungrad muslim-friendly",     href: "/c/halal-clinic/?city=bangkok",      icon: "🏥" },
  { label: "Halal cosmetics Bangkok",        href: "/c/halal-beauty/?city=bangkok",      icon: "💄" },
  { label: "Chiang Mai halal restaurants",   href: "/c/halal-food/?city=chiang-mai",     icon: "🥘" },
  { label: "Pattani mosque",                 href: "/c/mosque/?city=pattani",            icon: "🕌" },
  { label: "Hat Yai halal seafood",          href: "/c/halal-food/?city=hat-yai",        icon: "🥘" },
];

export default function HeroSearch({ lang }: { lang: string }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_SUGGESTIONS.slice(0, 6);
    return ALL_SUGGESTIONS.filter((s) => s.label.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!focused || filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sug = filtered[active];
      if (sug) window.location.href = `/${lang}${sug.href}`;
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative max-w-2xl">
      <form action={`/${lang}/search/`} className="relative">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl" aria-hidden="true">
          🔍
        </span>
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onFocus={() => setFocused(true)}
          onKeyDown={onKeyDown}
          autoComplete="off"
          placeholder="Find halal in Bangkok, Phuket, Krabi…"
          className="h-14 w-full rounded-full border border-white/15 bg-white/95 pl-14 pr-32 text-base font-medium text-islam-950 placeholder:text-ink-400 shadow-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold-400/30"
          aria-label="Search verified places"
          aria-autocomplete="list"
          aria-expanded={focused}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-islam-900 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-islam-800"
        >
          Search →
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {focused && filtered.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl ring-1 ring-black/5 dark:border-ink-700 dark:bg-ink-900">
          <div className="border-b border-ink-100 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gold-700 dark:border-ink-800 dark:text-gold-400">
            {query.trim() ? `Matching "${query}"` : "Popular searches"}
          </div>
          <ul role="listbox">
            {filtered.map((s, i) => (
              <li key={s.label}>
                <a
                  href={`/${lang}${s.href}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    i === active
                      ? "bg-islam-50 text-islam-950 dark:bg-islam-950/40 dark:text-islam-100"
                      : "text-ink-800 hover:bg-sand-50 dark:text-ink-200 dark:hover:bg-ink-800"
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="flex-1 font-medium">{s.label}</span>
                  <span className="text-xs muted">↵</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink-100 px-4 py-2 text-[10px] muted dark:border-ink-800">
            ↑ ↓ to navigate · ↵ to select · Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
