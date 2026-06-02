// Booking.com affiliate link generator.
//
// Partner approval: https://partners.booking.com — apply with the site URL,
// usually 1–3 days. After approval we get a numeric AID. Drop it in
// NEXT_PUBLIC_BOOKING_AFFILIATE_ID (env var) and links rewrite automatically.
//
// Until approved, links still work (Booking accepts unknown aid silently)
// but no commission accrues. Safe to ship the UI now.

import type { Place } from "./types";

const AID = process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID || "0000000";

// Common per-link params we want everywhere (label = analytics segment).
function tagParams(label: string): string {
  return new URLSearchParams({
    aid: AID,
    label,
    no_rooms: "1",
    group_adults: "2",
  }).toString();
}

/**
 * Build a Booking.com search-results URL for a place. The search box is
 * pre-filled with `name + city Thailand` so the first result is usually the
 * exact hotel.
 */
export function bookingSearchUrl(place: Pick<Place, "name" | "city">, label = "salaam-detail"): string {
  const ss = [place.name, place.city, "Thailand"].filter(Boolean).join(" ");
  const qs = new URLSearchParams({
    ss,
    aid: AID,
    label,
    no_rooms: "1",
    group_adults: "2",
  }).toString();
  return `https://www.booking.com/searchresults.html?${qs}`;
}

/**
 * Build an Agoda search URL with our affiliate cid. Agoda partner program
 * is separate; cid is in NEXT_PUBLIC_AGODA_AFFILIATE_CID.
 */
export function agodaSearchUrl(place: Pick<Place, "name" | "city">): string {
  const CID = process.env.NEXT_PUBLIC_AGODA_AFFILIATE_CID || "0";
  const q = [place.name, place.city].filter(Boolean).join(" ");
  return `https://www.agoda.com/search?q=${encodeURIComponent(q)}&cid=${CID}`;
}

/**
 * Which niches should surface a Booking.com / Agoda CTA?
 * Hotels and tour packages convert; restaurants don't.
 */
export function shouldShowBookingCta(niche: string): boolean {
  return niche === "muslim-hotel" || niche === "halal-tour" || niche === "iftar-buffet";
}

/**
 * For hotels we also want a quick "compare prices" link (Booking + Agoda
 * side-by-side). Returns the structured list the UI iterates over.
 */
export function priceCompareLinks(place: Pick<Place, "name" | "city" | "niche">) {
  if (!shouldShowBookingCta(place.niche)) return [];
  return [
    { label: "Booking.com", href: bookingSearchUrl(place, "salaam-compare"), brand: "booking" },
    { label: "Agoda",       href: agodaSearchUrl(place),                     brand: "agoda" },
  ];
}
