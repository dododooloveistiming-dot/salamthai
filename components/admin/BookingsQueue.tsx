"use client";
import { useEffect, useMemo, useState } from "react";
import { loadLocal, MOCK_BOOKINGS, type Booking, type BookingStatus } from "@/lib/booking";

const STATUS_PILL: Record<BookingStatus, string> = {
  pending:   "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  confirmed: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300",
  declined:  "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400",
  cancelled: "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400",
};

function fmtTimeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  } catch { return ""; }
}

export default function BookingsQueue() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [kvLive, setKvLive] = useState(false);

  async function refresh() {
    let server: Booking[] = [];
    let kv = false;
    try {
      const r = await fetch("/api/bookings/list", { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.bookings)) server = j.bookings;
        kv = !!j.kv;
      }
    } catch {}
    setKvLive(kv);

    const local = loadLocal();
    const ids = new Set(server.map((b) => b.id));
    const merged = [
      ...server,
      ...local.filter((b) => !ids.has(b.id)),
      ...MOCK_BOOKINGS.filter((b) => !ids.has(b.id)),
    ];
    setBookings(merged);
  }

  useEffect(() => { refresh(); }, []);

  const stats = useMemo(() => ({
    total:     bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    venues:    new Set(bookings.map((b) => b.placeId)).size,
  }), [bookings]);

  if (bookings.length === 0) {
    return (
      <div className="card-editorial p-8 text-center">
        <div className="text-3xl">📭</div>
        <p className="mt-2 text-sm muted">No bookings yet. They'll appear here as guests submit the booking form on place detail pages.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider muted">
        <span className={`grid h-2 w-2 place-items-center rounded-full ${kvLive ? "bg-islam-500" : "bg-rose-400"}`} />
        {kvLive ? "Live · KV synced" : "Local demo only — set up Vercel KV to persist"}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total bookings",      value: stats.total },
          { label: "Pending response",    value: stats.pending },
          { label: "Confirmed",           value: stats.confirmed },
          { label: "Venues with bookings", value: stats.venues },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-ink-100 bg-white p-3 dark:border-ink-800 dark:bg-ink-900">
            <div className="text-[10px] uppercase tracking-wider muted">{s.label}</div>
            <div className="mt-1 font-display text-2xl font-bold tabular-nums text-islam-950 dark:text-islam-50">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card-editorial overflow-hidden">
        <div className="border-b border-ink-100 p-5 dark:border-ink-800">
          <div className="eyebrow mb-1">All venues</div>
          <h3 className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
            Booking queue ({bookings.length})
          </h3>
          <p className="mt-1 text-xs muted">
            Every direct booking submitted on salaamthailand.com lands here. Venues get a Telegram alert if registered; otherwise you receive a forward-link to push it through manually.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-100 bg-sand-50/50 text-[10px] uppercase tracking-wider dark:border-ink-800 dark:bg-ink-800/40">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Guest</th>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Venue</th>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Date</th>
                <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Party</th>
                <th className="px-4 py-3 text-left font-bold text-ink-600 dark:text-ink-400">Submitted</th>
                <th className="px-4 py-3 text-right font-bold text-ink-600 dark:text-ink-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
              {bookings.map((b) => (
                <tr key={b.id} className="transition hover:bg-sand-50/40 dark:hover:bg-ink-800/40">
                  <td className="px-4 py-4">
                    <div className="font-bold text-islam-950 dark:text-islam-50">{b.guestName}</div>
                    <div className="mt-0.5 text-[10px] muted">{b.guestCountry || ""}</div>
                    <div className="mt-0.5 flex gap-2 text-[11px]">
                      <a href={`mailto:${b.guestEmail}`} className="text-islam-700 hover:text-gold-700 dark:text-islam-300">✉</a>
                      <a href={`https://wa.me/${b.guestPhone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-islam-700 hover:text-gold-700 dark:text-islam-300">💬</a>
                      <span className="muted font-mono">{b.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-islam-950 dark:text-islam-50">{b.placeName}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider muted">
                      {b.placeCity} · {b.placeNiche.replace("-", " ")}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-bold tabular-nums text-islam-700 dark:text-islam-300">{b.date}</div>
                    {b.time && <div className="mt-0.5 text-[11px] muted">{b.time}</div>}
                  </td>
                  <td className="px-4 py-4 text-right font-bold tabular-nums">{b.partySize}</td>
                  <td className="px-4 py-4 text-xs muted">{fmtTimeAgo(b.createdAt)}</td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_PILL[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
