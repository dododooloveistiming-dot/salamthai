import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { PlacesBundle, Place, PlaceLite, Niche, CommunityBundle } from "./types";

// Strip heavy fields off a Place for client-component props (Category / Search
// grids). Cuts ~80% off the HTML payload on niche pages with 500+ items because
// reviews_sample / community_mentions / top_review_text / source_badges / etc.
// were all serializing into the page even though list cards never read them.
export function toPlaceLite(p: Place): PlaceLite {
  const a = p.affiliate;
  const sb = p.source_badges;
  const source_count =
    (sb.google_reviews > 0 ? 1 : 0) +
    (sb.reddit > 0 ? 1 : 0) +
    (sb.videos > 0 ? 1 : 0) +
    (sb.naver > 0 ? 1 : 0) +
    (sb.pantip > 0 ? 1 : 0) +
    (sb.photos > 0 ? 1 : 0) +
    (sb.website > 0 ? 1 : 0) +
    (sb.bookimed > 0 ? 1 : 0);
  return {
    id: p.id,
    slug: p.slug,
    niche: p.niche,
    name: p.name,
    city: p.city,
    category: p.category,
    rating: p.rating,
    review_count: p.review_count,
    trust_score: p.trust_score,
    top_photo_url: p.top_photo_url,
    price_band: p.price_band,
    is_beginner_friendly: p.is_beginner_friendly,
    is_open_24h: p.is_open_24h,
    is_suspected_viral: p.is_suspected_viral,
    is_partner: p.is_partner,
    is_halal_signaled: p.is_halal_signaled,
    halal_signal_count: p.halal_signal_count,
    halal_signals_detected: p.halal_signals_detected,
    source_count,
    has_affiliate: !!(a.klook || a.viator || a.getyourguide || a.agoda || a.bookimed),
    languages: p.languages,
    has_arabic_reviews: p.has_arabic_reviews,
    arabic_review_count: p.arabic_review_count,
    has_youtube_comments: p.has_youtube_comments,
    youtube_comment_count: p.youtube_comment_count,
    has_osm: p.has_osm,
    has_wikipedia: p.has_wikipedia,
  };
}

/** Number of distinct sources that corroborate a place (Google, Reddit,
 *  videos, Naver, Pantip, photos, official website, Bookimed). */
export function sourceCount(p: Place): number {
  const sb = p.source_badges;
  return (
    (sb.google_reviews > 0 ? 1 : 0) +
    (sb.reddit > 0 ? 1 : 0) +
    (sb.videos > 0 ? 1 : 0) +
    (sb.naver > 0 ? 1 : 0) +
    (sb.pantip > 0 ? 1 : 0) +
    (sb.photos > 0 ? 1 : 0) +
    (sb.website > 0 ? 1 : 0) +
    (sb.bookimed > 0 ? 1 : 0)
  );
}

/** Single source of truth for "should search engines index this place page?"
 *  Used by both the place page's robots meta AND the sitemap so they never
 *  drift. Policy (2026-06-19): ≥ 2 corroborating sources AND Trust Score ≥ 20.
 *
 *  Why 20 and not 30: trust_score is NOT calibrated across niches — e.g. every
 *  halal-food place clusters at 21–24 while hotels/mosques sit at ~41. A 30 gate
 *  silently deindexed the ENTIRE flagship halal-food category (0 of 500) even
 *  though each has 3 corroborating sources. So we gate primarily on source
 *  corroboration and use 20 only as a floor to drop the genuine bottom tail.
 *
 *  NOTE: the original gate read `is_halal_signaled` / `halal_signal_count`,
 *  which the data pipeline no longer emits (always undefined) — that silently
 *  made EVERY place page noindex and emptied the place sitemaps. Do not
 *  reintroduce a dependency on those fields without restoring them in the data
 *  build first. */
export function isIndexable(p: Place): boolean {
  return sourceCount(p) >= 2 && p.trust_score >= 20;
}

let cache: PlacesBundle | null = null;
const byNicheCache = new Map<Niche, Place[]>();

export function loadPlaces(): PlacesBundle {
  if (cache) return cache;
  const p = path.join(process.cwd(), "public", "data", "places.json");
  if (!fs.existsSync(p)) {
    cache = {
      generated_at: new Date().toISOString(),
      total: 0,
      by_niche: {} as PlacesBundle["by_niche"],
      avg_trust: 0,
      places: [],
    };
    return cache;
  }
  const raw = fs.readFileSync(p, "utf-8");
  cache = JSON.parse(raw) as PlacesBundle;
  return cache;
}

export function getPlacesByNiche(niche: Niche): Place[] {
  if (byNicheCache.has(niche)) return byNicheCache.get(niche)!;
  const places = loadPlaces().places.filter((p) => p.niche === niche);
  byNicheCache.set(niche, places);
  return places;
}

const liteNicheCache = new Map<Niche, PlaceLite[]>();
export function getPlacesLiteByNiche(niche: Niche): PlaceLite[] {
  if (liteNicheCache.has(niche)) return liteNicheCache.get(niche)!;
  const lite = getPlacesByNiche(niche).map(toPlaceLite);
  liteNicheCache.set(niche, lite);
  return lite;
}

let allLiteCache: PlaceLite[] | null = null;
export function getAllPlacesLite(): PlaceLite[] {
  if (allLiteCache) return allLiteCache;
  allLiteCache = loadPlaces().places.map(toPlaceLite);
  return allLiteCache;
}

export function getPlaceBySlug(slug: string): Place | undefined {
  return loadPlaces().places.find((p) => p.slug === slug);
}

export function getTopPlaces(limit = 12): Place[] {
  return loadPlaces().places.slice(0, limit);
}

export function getTopPlacesPerNiche(perNiche = 3): Record<Niche, Place[]> {
  const bundle = loadPlaces();
  const result: Record<string, Place[]> = {};
  for (const niche of Object.keys(bundle.by_niche)) {
    result[niche] = getPlacesByNiche(niche as Niche).slice(0, perNiche);
  }
  return result as Record<Niche, Place[]>;
}

const communityCache = new Map<Niche, CommunityBundle | null>();
export function loadCommunity(niche: Niche): CommunityBundle | null {
  if (communityCache.has(niche)) return communityCache.get(niche)!;
  const p = path.join(process.cwd(), "public", "data", "community", `${niche}.json`);
  if (!fs.existsSync(p)) { communityCache.set(niche, null); return null; }
  try {
    const data = JSON.parse(fs.readFileSync(p, "utf-8")) as CommunityBundle;
    communityCache.set(niche, data);
    return data;
  } catch {
    communityCache.set(niche, null);
    return null;
  }
}
