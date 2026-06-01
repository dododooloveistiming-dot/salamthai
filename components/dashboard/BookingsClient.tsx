"use client";
import { useEffect, useMemo, useState } from "react";
import { loadLocal, updateLocalStatus, MOCK_BOOKINGS, type Booking, type BookingStatus } from "@/lib/booking";

const STATUS_LABEL: Record<BookingStatus, { label: string; cls: string }> = {
  pending:   { label: "Pending",    cls: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
  confirmed: { label: "Confirmed",  cls: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300" },
  declined:  { label: "Declined",   cls: "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400" },
  cancelled: { label: "Cancelled",  cls: "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400" },
};

export default function BookingsClient({ ownerPlaceId }: { ownerPlaceId: string }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [kvLive, setKvLive] = useState(false);

  // Pull from KV first (cross-device truth) and merge with mock + this
  // browser's localStorage. The local copy keeps demos working even before
  // KV is configured.
  async function refresh() {
    setLoading(true);
    let server: Booking[] = [];
    let kv = false;
    try {
      const r = await fetch(`/api/bookings/list?placeId=${encodeURIComponent(ownerPlaceId)}`, { cache: "no-store" });
      if (r.ok) {
        const j = await r.json();
        if (Array.isArray(j.bookings)) server = j.bookings;
        kv = !!j.kv;
      }
    } catch {}
    setKvLive(kv);

    const local = loadLocal().filter((b) => b.placeId === ownerPlaceId);
    const mock = MOCK_BOOKINGS.filter((b) => b.placeId === ownerPlaceId);

    // Server is authoritative; merge in local + mock if their id isn't in
    // server (prevents demo flicker when KV is empty).
    const ids = new Set(server.map((b) => b.id));
    const merged = [
      ...server,
      ...local.filter((b) => !ids.has(b.id)),
      ...mock.filter((b) => !ids.has(b.id)),
    ];
    setBookings(merged);
    setLoading(false);
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [ownerPlaceId]);

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);

  const counts = useMemo(() => ({
    all:       bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    declined:  bookings.filter((b) => b.status === "declined").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  }), [bookings]);

  async function setStatus(id: string, status: BookingStatus) {
    // Optimistic UI
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    updateLocalStatus(id, status);
    if (kvLive) {
      try {
        await fetch("/api/bookings/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status }),
        });
      } catch {}
    }
  }

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.partySize * 1500, 0);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-wider muted">
        <span className={`grid h-2 w-2 place-items-center rounded-full ${kvLive ? "bg-islam-500" : "bg-rose-400"}`} />
        {kvLive ? "Live · synced across devices" : "Local demo · KV not configured"}
        {loading && <span className="muted">· loading…</span>}
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Pending",   value: counts.pending,   color: "text-rose-700 dark:text-rose-300" },
          { label: "Confirmed", value: counts.confirmed, color: "text-islam-700 dark:text-islam-300" },
          { label: "Total this month", value: counts.all, color: "text-gold-700 dark:text-gold-400" },
          { label: "Est. revenue (confirmed)", value: `฿${totalRevenue.toLocaleString()}`, color: "text-islam-950 dark:text-islam-50" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
            <div className="text-[10px] uppercase tracking-wider muted">{k.label}</div>
            <div className={`mt-1 font-display text-2xl font-bold tabular-nums ${k.color} sm:text-3xl`}>
              {k.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {(["all", "pending", "confirmed", "declined", "cancelled"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
              filter === s
                ? "bg-islam-950 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABEL[s].label}
            <span className="ml-1.5 opacity-60">({counts[s]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-12 text-center dark:border-ink-700 dark:bg-ink-900">
          <div className="text-3xl">📭</div>
          <p className="mt-2 text-sm muted">No bookings in this filter yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((b) => {
            const phoneDigits = b.guestPhone.replace(/[^0-9]/g, "");
            const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
              `Salaam ${b.guestName}, this is ${b.placeName}. Confirming your booking for ${b.date}${b.time ? " at " + b.time : ""}, ${b.partySize} guests. Ref: ${b.id}.`
            )}`;
            return (
              <li key={b.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display text-base font-bold text-islam-950 dark:text-islam-50">
                        {b.guestName}
                      </span>
                      {b.guestCountry && (
                        <span className="text-xs muted">{b.guestCountry}</span>
                      )}
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_LABEL[b.status].cls}`}>
                        {STATUS_LABEL[b.status].label}
                      </span>
                    </div>
                    <div className="mt-1 text-xs muted font-mono">{b.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg font-bold tabular-nums text-islam-700 dark:text-islam-300">
                      {b.date}{b.time && <span className="ml-1">· {b.time}</span>}
                    </div>
                    <div className="text-xs muted">{b.partySize} {b.partySize === 1 ? "guest" : "guests"}</div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <a href={`mailto:${b.guestEmail}`} className="text-islam-700 hover:text-gold-700 dark:text-islam-300">
                    ✉ {b.guestEmail}
                  </a>
                  <a href={`tel:${b.guestPhone}`} className="text-islam-700 hover:text-gold-700 dark:text-islam-300">
                    📞 {b.guestPhone}
                  </a>
                </div>

                {b.notes && (
                  <p className="mt-3 rounded-md border-l-2 border-gold-400 bg-gold-50/50 px-3 py-2 text-xs leading-relaxed text-gold-900 dark:bg-gold-950/20 dark:text-gold-200">
                    💬 {b.notes}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {b.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatus(b.id, "confirmed")}
                        className="rounded-md bg-islam-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-islam-800"
                      >
                        ✓ Confirm
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(b.id, "declined")}
                        className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-700/60 dark:text-rose-300"
                      >
                        ✕ Decline
                      </button>
                    </>
                  ) : b.status === "confirmed" ? (
                    <button
                      type="button"
                      onClick={() => setStatus(b.id, "cancelled")}
                      className="rounded-md border border-orange-300 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-50 dark:border-orange-700/60 dark:text-orange-300"
                    >
                      Cancel booking
                    </button>
                  ) : null}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-islam-300 px-3 py-1.5 text-xs font-bold text-islam-900 hover:bg-islam-50 dark:border-islam-700 dark:text-islam-100"
                  >
                    💬 WhatsApp guest
                  </a>
                  <a
                    href={`mailto:${b.guestEmail}?subject=${encodeURIComponent(`Re: Booking ${b.id} — ${b.placeName}`)}`}
                    className="rounded-md border border-islam-300 px-3 py-1.5 text-xs font-bold text-islam-900 hover:bg-islam-50 dark:border-islam-700 dark:text-islam-100"
                  >
                    ✉ Reply by email
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
