// Upstash / Vercel KV helpers — accessed over plain HTTP REST so we add no
// npm dependency. Vercel KV is just an Upstash Redis instance behind the
// scenes, and both providers expose the same REST endpoints.
//
// Setup:
//   Vercel dashboard → Storage → Create Database → KV (Upstash)
//   → connect to project → it auto-injects:
//     KV_REST_API_URL
//     KV_REST_API_TOKEN
//     KV_REST_API_READ_ONLY_TOKEN  (we don't use this here)
//   → Redeploy. That's it.
//
// Keyspace:
//   booking:<id>            string (JSON of Booking)
//   bookings:all            list of booking ids (newest first)
//   bookings:place:<slug>   list of booking ids for one venue
//
// On every booking we LPUSH the id onto both lists and SET the full record
// under booking:<id>. Reads pull a range from the list and MGET the
// records. Updates (status change) just rewrite booking:<id>.

import type { Booking, BookingStatus } from "./booking";

const API_URL = process.env.KV_REST_API_URL;
const API_TOKEN = process.env.KV_REST_API_TOKEN;

function isConfigured(): boolean {
  return !!(API_URL && API_TOKEN);
}

async function cmd(path: string, body?: unknown): Promise<unknown> {
  if (!isConfigured()) {
    throw new Error("KV not configured");
  }
  const r = await fetch(`${API_URL}${path}`, {
    method: body !== undefined ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!r.ok) {
    const t = await r.text();
    throw new Error(`KV error ${r.status}: ${t}`);
  }
  const j = await r.json();
  return j.result;
}

export async function saveBooking(b: Booking): Promise<void> {
  if (!isConfigured()) return;
  await Promise.all([
    cmd(`/set/booking:${encodeURIComponent(b.id)}`, JSON.stringify(b)),
    cmd(`/lpush/bookings:all/${encodeURIComponent(b.id)}`),
    cmd(`/lpush/bookings:place:${encodeURIComponent(b.placeId)}/${encodeURIComponent(b.id)}`),
  ]);
}

async function getMany(ids: string[]): Promise<Booking[]> {
  if (ids.length === 0) return [];
  const keys = ids.map((id) => `booking:${id}`);
  const path = `/mget/${keys.map(encodeURIComponent).join("/")}`;
  const raw = (await cmd(path)) as Array<string | null>;
  return raw
    .filter((v): v is string => typeof v === "string")
    .map((v) => {
      try { return JSON.parse(v) as Booking; } catch { return null; }
    })
    .filter((b): b is Booking => b !== null);
}

export async function listAllBookings(limit = 100): Promise<Booking[]> {
  if (!isConfigured()) return [];
  const ids = (await cmd(`/lrange/bookings:all/0/${limit - 1}`)) as string[];
  return getMany(ids);
}

export async function listBookingsForPlace(placeId: string, limit = 100): Promise<Booking[]> {
  if (!isConfigured()) return [];
  const ids = (await cmd(`/lrange/bookings:place:${encodeURIComponent(placeId)}/0/${limit - 1}`)) as string[];
  return getMany(ids);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  if (!isConfigured()) return null;
  const raw = (await cmd(`/get/booking:${encodeURIComponent(id)}`)) as string | null;
  if (!raw) return null;
  let b: Booking;
  try { b = JSON.parse(raw); } catch { return null; }
  b.status = status;
  await cmd(`/set/booking:${encodeURIComponent(id)}`, JSON.stringify(b));
  return b;
}

export { isConfigured as kvReady };
