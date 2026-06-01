import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Salaam Thailand — Verified halal & muslim-friendly directory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)",
          color: "white",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Decorative gold blob top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "rgba(212, 175, 55, 0.18)",
            filter: "blur(60px)",
          }}
        />
        {/* Decorative emerald blob bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.18)",
            filter: "blur(60px)",
          }}
        />

        {/* Crescent icon */}
        <div style={{ fontSize: 96, color: "#d4af37", marginBottom: 16 }}>☪</div>

        {/* Brand name */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            marginBottom: 16,
            display: "flex",
            alignItems: "baseline",
          }}
        >
          Salaam
          <span style={{ color: "#d4af37", marginLeft: 16 }}>Thailand</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 34,
            color: "#fef3c7",
            opacity: 0.95,
            marginTop: 4,
            marginBottom: 36,
            fontStyle: "italic",
          }}
        >
          Verified halal · No paid promotion
        </div>

        {/* Sub stats */}
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 22,
            color: "#a7f3d0",
            letterSpacing: "0.04em",
          }}
        >
          <span>2,300+ verified places</span>
          <span>·</span>
          <span>34 categories</span>
          <span>·</span>
          <span>6 languages</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
