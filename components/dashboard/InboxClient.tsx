"use client";
import { useMemo, useState } from "react";
import type { MockInquiry } from "@/lib/dashboard-mock";

const STATUS_PILL: Record<MockInquiry["status"], { label: string; color: string }> = {
  new:     { label: "New",     color: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300" },
  replied: { label: "Replied", color: "bg-gold-100 text-gold-800 dark:bg-gold-950/40 dark:text-gold-300" },
  booked:  { label: "Booked",  color: "bg-islam-100 text-islam-700 dark:bg-islam-950/50 dark:text-islam-300" },
  lost:    { label: "Lost",    color: "bg-ink-150 text-ink-700 dark:bg-ink-800 dark:text-ink-400" },
};

const TEMPLATES = [
  { key: "ack", label: "Quick acknowledge",
    body: "Salaam {name}, thank you for your inquiry. We confirm availability for your dates ({arrival}, {nights} nights, {guests} guests). One of our team will be in touch shortly with full details." },
  { key: "confirm", label: "Confirm + price",
    body: "Salaam {name}, we have your dates confirmed. Total {nights} nights × {rooms} room(s) = ฿XX,XXX (incl. halal breakfast). Includes prayer kit on arrival, qibla-marked rooms, and a separate halal kitchen. Shall I send a formal booking link?" },
  { key: "decline", label: "No availability",
    body: "Salaam {name}, unfortunately your selected dates ({arrival}) are fully booked. We have the following alternative dates available: [DATES]. Apologies, and please consider us for a future visit." },
];

export default function InboxClient({ inquiries }: { inquiries: MockInquiry[] }) {
  const [selectedId, setSelectedId] = useState<number>(inquiries[0]?.id ?? 0);
  const [statusFilter, setStatusFilter] = useState<"all" | MockInquiry["status"]>("all");
  const [replyText, setReplyText] = useState("");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return inquiries;
    return inquiries.filter((i) => i.status === statusFilter);
  }, [inquiries, statusFilter]);

  const selected = inquiries.find((i) => i.id === selectedId) || inquiries[0];

  const counts = {
    all:     inquiries.length,
    new:     inquiries.filter((i) => i.status === "new").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    booked:  inquiries.filter((i) => i.status === "booked").length,
    lost:    inquiries.filter((i) => i.status === "lost").length,
  };

  function applyTemplate(tplKey: string) {
    const tpl = TEMPLATES.find((t) => t.key === tplKey);
    if (!tpl || !selected) return;
    setReplyText(
      tpl.body
        .replace("{name}", selected.name)
        .replace("{arrival}", selected.arrival)
        .replace("{nights}", String(selected.nights))
        .replace("{guests}", String(selected.guests))
        .replace("{rooms}", String(selected.rooms)),
    );
  }

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      {/* Header */}
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">Inbox</div>
          <h1 className="h-display text-3xl font-bold text-islam-950 dark:text-islam-50 sm:text-4xl">
            Inquiries
          </h1>
          <p className="mt-1 text-sm muted">
            {counts.all} total · {counts.new} new · click to reply inline
          </p>
        </div>
        <button className="rounded-md bg-islam-950 px-3 py-1.5 text-xs font-bold text-white hover:bg-islam-900">
          Mark all read
        </button>
      </header>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "all",     label: "All",     count: counts.all },
          { key: "new",     label: "New",     count: counts.new },
          { key: "replied", label: "Replied", count: counts.replied },
          { key: "booked",  label: "Booked",  count: counts.booked },
          { key: "lost",    label: "Lost",    count: counts.lost },
        ].map((c) => (
          <button
            key={c.key}
            onClick={() => setStatusFilter(c.key as any)}
            className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
              statusFilter === c.key
                ? "border-islam-700 bg-islam-700 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-islam-400 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
            }`}
          >
            {c.label} <span className="ml-1 opacity-70">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Split view: list + detail */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr]">
        {/* ── LIST ── */}
        <ul className="card-editorial divide-y divide-ink-100 overflow-hidden dark:divide-ink-800">
          {filtered.map((inq) => {
            const overSla = inq.status === "new" && inq.sla_remaining_min < 0;
            const isActive = inq.id === selectedId;
            const pill = STATUS_PILL[inq.status];
            return (
              <li key={inq.id}>
                <button
                  onClick={() => setSelectedId(inq.id)}
                  className={`block w-full p-4 text-left transition ${
                    isActive
                      ? "bg-islam-50 dark:bg-islam-950/30"
                      : "hover:bg-sand-50/40 dark:hover:bg-ink-800/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{inq.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-bold text-islam-950 dark:text-islam-50">{inq.name}</span>
                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${pill.color}`}>
                          {pill.label}
                        </span>
                      </div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-wider muted">
                        {inq.country} · {inq.language} · {inq.received_at}
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-ink-700 dark:text-ink-300">
                        {inq.message_preview}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[10px] muted">
                          📅 {inq.arrival} · {inq.nights}n · {inq.guests}p
                        </span>
                        {inq.status === "new" && (
                          overSla ? (
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">⚠ SLA</span>
                          ) : (
                            <span className="text-[10px] font-bold text-islam-700 dark:text-islam-300">
                              {inq.sla_remaining_min}m
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* ── DETAIL + REPLY ── */}
        {selected && (
          <div className="card-editorial overflow-hidden">
            {/* detail header */}
            <div className="border-b border-ink-100 p-5 dark:border-ink-800">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{selected.flag}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-xl font-bold text-islam-950 dark:text-islam-50 sm:text-2xl">
                    {selected.name}
                  </h2>
                  <div className="mt-1 text-xs muted">
                    {selected.country} · {selected.language} · {selected.email}
                    {selected.whatsapp && <> · 📱 {selected.whatsapp}</>}
                  </div>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${STATUS_PILL[selected.status].color}`}>
                  {STATUS_PILL[selected.status].label}
                </span>
              </div>

              {/* Booking grid */}
              <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "Arrival",  v: selected.arrival },
                  { label: "Nights",   v: selected.nights },
                  { label: "Guests",   v: selected.guests },
                  { label: "Rooms",    v: selected.rooms },
                ].map((b) => (
                  <div key={b.label}>
                    <dt className="text-[10px] uppercase tracking-wider muted">{b.label}</dt>
                    <dd className="mt-0.5 font-display text-lg font-bold tabular-nums text-islam-950 dark:text-islam-50">
                      {b.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Message */}
            <div className="border-b border-ink-100 p-5 dark:border-ink-800">
              <div className="eyebrow mb-2">Message</div>
              <p className="text-sm leading-relaxed text-ink-800 dark:text-ink-200">
                {selected.message_preview}
              </p>
            </div>

            {/* Reply form */}
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="eyebrow">Reply</div>
                <div className="flex gap-2">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.key}
                      onClick={() => applyTemplate(tpl.key)}
                      className="rounded-md border border-ink-200 bg-white px-2.5 py-1 text-[10px] font-bold text-ink-700 hover:border-gold-400 hover:bg-gold-50 hover:text-gold-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Salaam ${selected.name}, thank you for your inquiry…`}
                className="w-full rounded-lg border border-ink-200 bg-white p-3 text-sm leading-relaxed text-ink-800 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-400/20 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"
                rows={6}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[10px] muted">
                  Will be sent via email{selected.whatsapp && " + WhatsApp"} · auto-translated to {selected.language}
                </div>
                <div className="flex gap-2">
                  <button className="rounded-md border border-ink-200 bg-white px-3 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300">
                    Save draft
                  </button>
                  <button className="rounded-md bg-islam-950 px-4 py-1.5 text-xs font-bold text-white hover:bg-islam-900">
                    Send reply →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
