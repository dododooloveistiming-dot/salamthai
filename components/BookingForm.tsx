"use client";
import { useEffect, useState } from "react";
import { newBookingId, saveLocal, nicheRequiresTime, type Booking } from "@/lib/booking";

interface Props {
  placeId: string;
  placeName: string;
  placeNiche: string;
  placeCity: string;
  placePhone?: string;
  placeWebsite?: string;
  placeMapsUrl?: string;
  triggerLabel?: string;
}

const COUNTRIES = [
  "🇸🇦 Saudi Arabia", "🇦🇪 UAE", "🇶🇦 Qatar", "🇰🇼 Kuwait", "🇴🇲 Oman", "🇧🇭 Bahrain",
  "🇲🇾 Malaysia", "🇮🇩 Indonesia", "🇧🇳 Brunei", "🇸🇬 Singapore",
  "🇰🇷 Korea", "🇯🇵 Japan", "🇨🇳 China",
  "🇬🇧 UK", "🇺🇸 US", "🇫🇷 France", "🇩🇪 Germany",
  "🇹🇭 Thailand (local)", "Other",
];

export default function BookingForm({ placeId, placeName, placeNiche, placeCity, placePhone, placeWebsite, placeMapsUrl, triggerLabel = "Book directly" }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { id: string }>(null);
  const [err, setErr] = useState<string | null>(null);

  const needsTime = nicheRequiresTime(placeNiche);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);

    const booking: Booking = {
      id: newBookingId(),
      placeId, placeName, placeNiche, placeCity,
      guestName: name.trim(),
      guestEmail: email.trim(),
      guestPhone: phone.trim(),
      guestCountry: country,
      date, time: needsTime ? time : undefined,
      partySize, notes: notes.trim() || undefined,
      status: "pending",
      channel: "salaam-thailand",
      createdAt: new Date().toISOString(),
    };

    try {
      const r = await fetch("/api/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...booking, placePhone, placeWebsite, placeMapsUrl }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw new Error(j.error || "Submit failed");
      }
      saveLocal(booking);
      setDone({ id: booking.id });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Submit failed";
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { setOpen(true); setDone(null); setErr(null); }}
        className="block w-full rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 px-5 py-3.5 text-center text-sm font-bold text-islam-950 shadow-md transition hover:from-gold-400 hover:to-gold-600 hover:shadow-lg"
      >
        💬 {triggerLabel} — direct
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="bk-title">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl ring-1 ring-islam-200 dark:bg-ink-900 dark:ring-islam-800 sm:rounded-3xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white/95 px-5 py-3.5 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95">
              <div>
                <div className="eyebrow !text-[10px]">Direct booking</div>
                <h2 id="bk-title" className="font-display text-lg font-bold text-islam-950 dark:text-islam-50">
                  {placeName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-lg border border-ink-200 transition hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-800"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            {done ? (
              <div className="p-6 text-center">
                <div className="mb-4 grid h-16 w-16 mx-auto place-items-center rounded-full bg-islam-100 text-3xl dark:bg-islam-950/40">✓</div>
                <h3 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50">
                  Booking request sent
                </h3>
                <p className="mt-2 text-sm muted">
                  Reference <strong className="text-islam-700 dark:text-islam-300">{done.id}</strong>. The venue will contact you within
                  24 hours via email or WhatsApp. We've also CC'd Salaam Thailand operations so the lead doesn't fall through.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-islam-950 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-islam-900"
                >
                  Got it
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-5 space-y-4">
                <p className="text-xs muted">
                  We forward your request directly to {placeName}. <strong>No fee</strong>, no Booking.com markup —
                  Salaam Thailand is paid by the venue (or affiliate partners), never by you.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">Full name *</span>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">Country *</span>
                    <select
                      value={country} onChange={(e) => setCountry(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    >
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">Email *</span>
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">WhatsApp / phone *</span>
                    <input
                      type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+66 ..."
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    />
                  </label>
                </div>

                <div className={`grid gap-3 ${needsTime ? "grid-cols-3" : "grid-cols-2"}`}>
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">Date *</span>
                    <input
                      type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    />
                  </label>
                  {needsTime && (
                    <label className="block">
                      <span className="text-[10px] uppercase tracking-wider muted">Time *</span>
                      <input
                        type="time" required={needsTime} value={time} onChange={(e) => setTime(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                      />
                    </label>
                  )}
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-wider muted">Party size *</span>
                    <input
                      type="number" required min={1} max={50} value={partySize}
                      onChange={(e) => setPartySize(Math.max(1, Number(e.target.value) || 1))}
                      className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider muted">Notes (optional)</span>
                  <textarea
                    rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="Halal kitchen confirmation, prayer kit, women-only hours, etc."
                    className="mt-1 w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-950"
                  />
                </label>

                {err && <p className="text-sm text-rose-700 dark:text-rose-300">⚠ {err}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="block w-full rounded-xl bg-islam-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-islam-900 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : `Send booking request →`}
                </button>

                <p className="text-center text-[10px] muted">
                  By submitting you agree to be contacted by {placeName} regarding this booking.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
