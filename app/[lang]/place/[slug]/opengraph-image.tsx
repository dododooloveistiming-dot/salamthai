// Per-place dynamic OG image — generated at the edge, 1200x630.
//
// Social shares (WhatsApp, Telegram, Twitter, Facebook, LinkedIn) will all
// scrape this URL for each place page. The card shows brand + place name +
// city + Trust score + signal pills + the brand "no paid promotion" line.

import { ImageResponse } from "next/og";
import { getPlaceBySlug } from "@/lib/data";
import { NICHE_META, nicheName } from "@/lib/types";
import type { Lang } from "@/lib/types";

// Note: nodejs runtime (not edge) because we read place data via lib/data
// which uses node:fs. Slower cold start but acceptable for OG images that
// get cached aggressively by social platforms.
export const alt = "Salaam Thailand verified place";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { lang: Lang; slug: string } }) {
  const place = getPlaceBySlug(params.slug);

  // Fallback when slug is missing — should be rare since OG images are tied
  // to existing static routes.
  if (!place) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #022c22 0%, #064e3b 100%)",
            color: "white",
            fontSize: 64,
            fontFamily: "serif",
          }}
        >
          Salaam Thailand
        </div>
      ),
      { ...size }
    );
  }

  const meta = NICHE_META[place.niche];
  const cat = nicheName(place.niche, params.lang);
  const trust = place.trust_score;
  const trustColor = trust >= 70 ? "#10b981" : trust >= 45 ? "#f59e0b" : "#fb7185";

  // Signal pills (short, max 4)
  const pills: { text: string; bg: string }[] = [];
  if (place.is_halal_signaled) pills.push({ text: "✓ Halal signals", bg: "rgba(212,175,55,0.20)" });
  if (place.cicot_mentioned) pills.push({ text: "✓ CICOT", bg: "rgba(16,185,129,0.20)" });
  if (place.has_arabic_reviews && place.arabic_review_count) {
    pills.push({ text: `🇸🇦 ${place.arabic_review_count} Arabic`, bg: "rgba(212,175,55,0.20)" });
  }
  if (place.has_osm) pills.push({ text: "🌍 OSM verified", bg: "rgba(16,185,129,0.20)" });

  // City line
  const cityLine = place.city ? `${place.city} · Thailand` : "Thailand";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
          color: "white",
          fontFamily: "serif",
          position: "relative",
          padding: "64px 72px",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            top: -120, right: -120,
            width: 380, height: 380, borderRadius: "50%",
            background: "rgba(212, 175, 55, 0.18)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100, left: -100,
            width: 340, height: 340, borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.18)",
            filter: "blur(60px)",
          }}
        />

        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#d4af37", letterSpacing: "0.08em" }}>
          <span style={{ fontSize: 36 }}>☪</span>
          <span style={{ fontWeight: 700 }}>SALAAM THAILAND</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{cat}</span>
        </div>

        {/* Main name */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "white",
            maxWidth: 1000,
          }}
        >
          {place.name.length > 56 ? place.name.slice(0, 55) + "…" : place.name}
        </div>

        {/* City */}
        <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: "#fef3c7", fontStyle: "italic" }}>
          📍 {cityLine}
        </div>

        {/* Trust badge + pills */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 36, flexWrap: "wrap" }}>
          {/* Trust circle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "rgba(255,255,255,0.10)",
              border: `3px solid ${trustColor}`,
              borderRadius: 999,
              padding: "12px 22px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em" }}>TRUST</span>
              <span style={{ fontSize: 40, fontWeight: 900, color: trustColor }}>{trust}<span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>/100</span></span>
            </div>
          </div>
          {/* Pills */}
          {pills.slice(0, 3).map((p) => (
            <div
              key={p.text}
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 700,
                padding: "10px 18px",
                borderRadius: 999,
                background: p.bg,
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {p.text}
            </div>
          ))}
        </div>

        {/* Footer line — brand promise */}
        <div style={{ display: "flex", marginTop: "auto", fontSize: 24, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>
          Cross-verified across 8 sources · No paid promotion
        </div>
      </div>
    ),
    { ...size }
  );
}
