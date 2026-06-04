// Email list storage — uses the same Upstash/Vercel KV that backs the
// booking inquiry pipeline. Adds an email to the muslim-traveler newsletter
// list for Ramadan 2027 + future seasonal campaigns.
//
// Key shape:
//   email:<lowercased>        JSON {email, name?, country?, source, lang, subscribed_at}
//   emails:all                LPUSH list of normalized emails (newest first)
//   emails:source:<source>    LPUSH list per acquisition source (ramadan-2027, etc.)
//
// When KV isn't configured (local/preview before Vercel KV link), the API
// route should still return 200 — we log the signup and accept it. That way
// the form works end-to-end on day 1 and we can wire KV later.

const API_URL = process.env.KV_REST_API_URL;
const API_TOKEN = process.env.KV_REST_API_TOKEN;

export interface Subscriber {
  email: string;
  name?: string;
  country?: string;
  source: string;          // e.g., "ramadan-2027", "footer", "place-page"
  lang: string;
  subscribed_at: string;   // ISO
}

export function isKvConfigured(): boolean {
  return !!(API_URL && API_TOKEN);
}

async function kv(path: string, body?: unknown): Promise<unknown> {
  if (!isKvConfigured()) throw new Error("KV not configured");
  const r = await fetch(`${API_URL}${path}`, {
    method: body !== undefined ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(`KV error: ${r.status}`);
  return r.json();
}

export function normalize(email: string): string {
  return (email || "").trim().toLowerCase();
}

export function isValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function addSubscriber(s: Subscriber): Promise<{ added: boolean; already: boolean }> {
  if (!isKvConfigured()) {
    // graceful: pretend it worked, log for later import
    console.log("[email-list] (no-KV) would add", s.email, s.source, s.lang);
    return { added: true, already: false };
  }
  const key = `email:${normalize(s.email)}`;
  // Check exists
  try {
    const existing = await kv(`/get/${encodeURIComponent(key)}`);
    if ((existing as { result?: string }).result) {
      return { added: false, already: true };
    }
  } catch { /* not found — proceed */ }
  // Set the subscriber blob
  await kv(`/set/${encodeURIComponent(key)}`, [JSON.stringify(s)]);
  // LPUSH onto global + source lists
  await kv(`/lpush/${encodeURIComponent("emails:all")}`, [normalize(s.email)]);
  await kv(`/lpush/${encodeURIComponent(`emails:source:${s.source}`)}`, [normalize(s.email)]);
  return { added: true, already: false };
}
