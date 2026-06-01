// Booking domain types + localStorage helpers.
//
// Architecture:
//   1. User submits BookingForm → POST /api/booking/submit
//   2. API route: forwards as email to operator (thaiconnect33@gmail.com)
//      via Resend if RESEND_API_KEY is set, otherwise logs to server console.
//   3. Client also writes the booking to localStorage so the owner-dashboard
//      and the admin page can preview it immediately (demo / single-browser).
//
// When we wire up a real DB (Neon + Drizzle) we replace `saveLocal` and the
// reads in <BookingsClient/> + admin <BookingsQueue/> with server queries —
// the rest of the booking surface (form, API, email) stays as-is.

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

export interface Booking {
  id: string;
  placeId: string;
  placeName: string;
  placeNiche: string;
  placeCity: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry?: string;
  date: string;          // ISO YYYY-MM-DD
  time?: string;         // HH:mm (optional, depends on niche)
  partySize: number;
  notes?: string;
  status: BookingStatus;
  channel: "salaam-thailand";
  createdAt: string;     // ISO
}

const LS_KEY = "salaam-bookings-v1";

export function saveLocal(b: Booking): void {
  if (typeof window === "undefined") return;
  try {
    const all = loadLocal();
    all.unshift(b);
    localStorage.setItem(LS_KEY, JSON.stringify(all.slice(0, 200)));
  } catch {}
}

export function loadLocal(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function updateLocalStatus(id: string, status: BookingStatus): void {
  if (typeof window === "undefined") return;
  try {
    const all = loadLocal();
    const next = all.map((b) => (b.id === id ? { ...b, status } : b));
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  } catch {}
}

export function newBookingId(): string {
  return `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

// ─────────────── Mock entries (so empty dashboards still look alive) ────────

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "BK-DEMO-001", placeId: "demo-almeroz", placeName: "Al Meroz Hotel", placeNiche: "muslim-hotel", placeCity: "Bangkok",
    guestName: "Ahmed Al-Sayed", guestEmail: "ahmed.s@example.com", guestPhone: "+966 50 123 4567", guestCountry: "🇸🇦 Saudi Arabia",
    date: "2026-06-04", time: "15:00", partySize: 4, notes: "Family of 4 — Iftar timing, prayer kit please.",
    status: "pending", channel: "salaam-thailand", createdAt: "2026-05-26T08:13:00.000Z",
  },
  {
    id: "BK-DEMO-002", placeId: "demo-almeroz", placeName: "Al Meroz Hotel", placeNiche: "muslim-hotel", placeCity: "Bangkok",
    guestName: "Faridah binti Ismail", guestEmail: "faridah.i@example.com", guestPhone: "+60 12 345 6789", guestCountry: "🇲🇾 Malaysia",
    date: "2026-06-08", partySize: 2, notes: "Anniversary trip — top-floor room if possible.",
    status: "confirmed", channel: "salaam-thailand", createdAt: "2026-05-25T15:42:00.000Z",
  },
  {
    id: "BK-DEMO-003", placeId: "demo-yana", placeName: "Yana Halal Restaurant", placeNiche: "halal-food", placeCity: "Bangkok",
    guestName: "박지훈", guestEmail: "jihoon.park@example.com", guestPhone: "+82 10 9876 5432", guestCountry: "🇰🇷 Korea",
    date: "2026-05-28", time: "19:30", partySize: 6, notes: "Korean tourists — table near window please.",
    status: "pending", channel: "salaam-thailand", createdAt: "2026-05-26T01:08:00.000Z",
  },
];

export function nicheRequiresTime(niche: string): boolean {
  return niche === "halal-food" || niche === "iftar-buffet" || niche === "halal-tour";
}
