"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Lang, Niche, Place } from "@/lib/types";
import { NICHE_META, nicheName } from "@/lib/types";
import { SkeletonGrid } from "./PlaceCardSkeleton";

type SearchHit = Place & { score: number };

const NICHE_FILTERS: Array<{ key: Niche | "all"; label: string; emoji: string }> = [
  { key: "all",          label: "All",         emoji: "🌙" },
  { key: "halal-food",   label: "Food",        emoji: "🥘" },
  { key: "muslim-hotel", label: "Hotels",      emoji: "🏨" },
  { key: "halal-tour",   label: "Tours",       emoji: "✈️" },
  { key: "mosque",       label: "Mosques",     emoji: "🕌" },
  { key: "halal-clinic", label: "Clinics",     emoji: "🏥" },
  { key: "halal-beauty", label: "Beauty",      emoji: "💄" },
];

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[\s,\-_]+/).filter((t) => t.length > 0);
}

function scorePlace(p: Place, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const name = (p.name || "").toLowerCase();
  const city = (p.city || "").toLowerCase();
  const cat = (p.category || "").toLowerCase();
  const niche = (p.niche || "").toLowerCase();
  const addr = (p.address || "").toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (name.includes(t)) s += 10;
    if (city.includes(t)) s += 6;
    if (niche.includes(t)) s += 5;
    if (cat.includes(t)) s += 3;
    if (addr.includes(t)) s += 2;
  }
  return s > 0 ? s + p.trust_score / 100 : 0;
}

export default function SearchClient({ lang, initialQuery }: { lang: Lang; initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [nicheFilter, setNicheFilter] = useState<Niche | "all">("all");
  const [allPlaces, setAllPlaces] = useState<Place[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch("/data/places.json")
      .then((r) => r.json())
      .then((b) => {
        if (!cancelled) {
          setAllPlaces(b.places || []);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(String(e));
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Search results vs Featured fallback
  const { results, mode } = useMemo(() => {
    if (!allPlaces) return { results: [] as SearchHit[], mode: "empty" as const };
    const tokens = tokenize(query);
    const filterFn = (p: Place) => (nicheFilter === "all" || p.niche === nicheFilter);

    if (tokens.length === 0) {
      // No query — show top-trust featured per filter
      const featured = allPlaces
        .filter(filterFn)
        .sort((a, b) => b.trust_score - a.trust_score)
        .slice(0, 12)
        .map((p) => ({ ...p, score: p.trust_score }));
      return { results: featured, mode: "featured" as const };
    }

    const scored = allPlaces
      .filter(filterFn)
      .map((p) => ({ ...p, score: scorePlace(p, tokens) }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 60);
    return { results: scored, mode: "search" as const };
  }, [allPlaces, query, nicheFilter]);

  // Get niche counts for chip badges
  const nicheCounts = useMemo(() => {
    if (!allPlaces) return {} as Record<string, number>;
    const counts: Record<string, number> = { all: allPlaces.length };
    for (const p of allPlaces) {
      counts[p.niche] = (counts[p.niche] ?? 0) + 1;
    }
    return counts;
  }, [allPlaces]);

  const suggestionRow = [
    "Bangkok halal restaurant",
    "Phuket muslim hotel",
    "Krabi halal tour",
    "Mosque Bangkok",
    "Halal beauty Bangkok",
    "Iftar buffet",
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
      <div className="eyebrow mb-2">Search</div>
      <h1 className="h-display text-3xl text-islam-950 dark:text-islam-50 sm:text-5xl">
        Find <span className="text-gradient-gold">verified</span> places
      </h1>

      {/* Search input */}
      <form className="mt-8" onSubmit={(e) => e.preventDefault()}>
        <label className="block">
          <div className="relative">
            <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl" aria-hidden="true">🔍</span>
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: Bangkok halal · Al Meroz · Krabi muslim hotel · mosque Phuket"
              autoFocus
              className="h-14 w-full rounded-full border border-ink-200 bg-white pl-14 pr-6 text-base font-medium text-islam-950 shadow-sm focus:border-gold-400 focus:outline-none focus:ring-4 focus:ring-gold-400/20 dark:border-ink-700 dark:bg-ink-900 dark:text-islam-100"
              aria-label="Search verified places"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-ink-100 px-2 py-1 text-xs text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </label>
      </form>

      {/* Niche filter chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {NICHE_FILTERS.map((f) => {
          const count = nicheCounts[f.key] ?? 0;
          const isActive = f.key === nicheFilter;
          if (f.key !== "all" && count === 0) return null;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setNicheFilter(f.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                isActive
                  ? "border-islam-700 bg-islam-700 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-islam-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
              }`}
            >
              <span>{f.emoji}</span>
              <span>{f.label}</span>
              {count > 0 && (
                <span className={`ml-1 rounded-md px-1.5 text-[10px] ${isActive ? "bg-white/20" : "bg-ink-100 dark:bg-ink-800"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quick-search chips (only when no query) */}
      {!query.trim() && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs muted">Quick search:</span>
          {suggestionRow.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-700 transition hover:border-gold-400 hover:bg-gold-50 hover:text-gold-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results header */}
      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          {loading ? (
            <span className="inline-flex items-center gap-2 text-sm muted">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-gold-500" />
              Loading places…
            </span>
          ) : mode === "featured" ? (
            <>
              <div className="eyebrow mb-1">Featured · top trust</div>
              <h2 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                {nicheFilter === "all" ? "Highest-trust places" : `Top ${NICHE_FILTERS.find((f) => f.key === nicheFilter)?.label}`}
              </h2>
            </>
          ) : results.length > 0 ? (
            <>
              <div className="eyebrow mb-1">Search</div>
              <h2 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                {results.length} match{results.length === 1 ? "" : "es"} for &quot;{query}&quot;
              </h2>
            </>
          ) : (
            <>
              <div className="eyebrow mb-1">No matches</div>
              <h2 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                Try a city or category instead
              </h2>
            </>
          )}
        </div>
        {error && <span className="text-xs text-rose-600">Error: {error}</span>}
      </div>

      {/* Skeleton while loading */}
      {loading && (
        <div className="mt-6">
          <SkeletonGrid count={6} />
        </div>
      )}

      {/* Results grid */}
      {!loading && results.length > 0 && (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => {
            const meta = NICHE_META[p.niche];
            const tierColor =
              p.trust_score >= 70 ? "text-islam-700 dark:text-islam-300" :
              p.trust_score >= 45 ? "text-gold-700 dark:text-gold-400" :
                                    "text-rose-600 dark:text-rose-400";
            const isFeatured = mode === "featured" && i < 3;
            return (
              <li key={p.id}>
                <Link
                  href={`/${lang}/place/${p.slug}/`}
                  className="card-editorial group flex h-full flex-col gap-3 overflow-hidden"
                >
                  {p.top_photo_url ? (
                    <div className="relative aspect-video w-full overflow-hidden bg-ink-50 dark:bg-ink-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.top_photo_url} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                      <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-black tabular-nums shadow-sm">
                        <span className={tierColor}>{p.trust_score}</span>
                        <span className="text-ink-500"> /100</span>
                      </span>
                      {isFeatured && (
                        <span className="absolute left-2 top-2 rounded-md bg-gold-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-islam-950 shadow-sm">
                          ⭐ #{i + 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-islam-50 to-gold-50 text-5xl dark:from-islam-950/40 dark:to-gold-950/30">
                      {meta.emoji}
                      <span className="absolute right-2 top-2 rounded-md bg-white/95 px-1.5 py-0.5 text-xs font-black tabular-nums shadow-sm">
                        <span className={tierColor}>{p.trust_score}</span>
                        <span className="text-ink-500"> /100</span>
                      </span>
                      {isFeatured && (
                        <span className="absolute left-2 top-2 rounded-md bg-gold-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-islam-950 shadow-sm">
                          ⭐ #{i + 1}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="px-4 pb-4">
                    <div className="text-[10px] uppercase tracking-wider text-gold-700 dark:text-gold-400">
                      {nicheName(p.niche, lang)}
                      {p.city && ` · ${p.city}`}
                    </div>
                    <h3 className="mt-1 font-display text-lg font-bold leading-tight text-islam-950 dark:text-islam-50">
                      {p.name}
                    </h3>
                    {p.rating != null && (
                      <div className="mt-1 text-xs muted">
                        ★ {p.rating.toFixed(1)}
                        {p.review_count ? ` (${p.review_count.toLocaleString()})` : ""}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1 text-[10px]">
                      {p.is_halal_signaled && (
                        <span className="rounded-full bg-gold-100 px-1.5 py-0.5 font-bold text-gold-800 dark:bg-gold-950/40 dark:text-gold-300">
                          ☪ Halal
                        </span>
                      )}
                      {p.languages.ko && (
                        <span className="rounded-full bg-rose-100 px-1.5 py-0.5 font-medium text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                          🇰🇷
                        </span>
                      )}
                      {p.languages.ar && (
                        <span className="rounded-full bg-amber-100 px-1.5 py-0.5 font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          🇸🇦
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {/* Empty state */}
      {!loading && results.length === 0 && query.trim() && (
        <div className="mt-8 rounded-2xl border border-dashed border-islam-300 bg-islam-50/30 p-8 text-center dark:border-islam-700/60 dark:bg-islam-950/20">
          <div className="text-4xl">🔍</div>
          <p className="mt-3 font-display text-base font-bold text-islam-900 dark:text-islam-100">
            No matches for &quot;{query}&quot;
          </p>
          <p className="mt-1 text-sm muted">
            Try a city (Bangkok, Phuket, Krabi), category above, or clear search to browse featured.
          </p>
          <button
            onClick={() => { setQuery(""); setNicheFilter("all"); }}
            className="mt-4 rounded-md bg-islam-950 px-4 py-2 text-xs font-bold text-white hover:bg-islam-900"
          >
            Reset · show featured
          </button>
        </div>
      )}
    </main>
  );
}
