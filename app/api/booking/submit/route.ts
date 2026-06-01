// POST /api/booking/submit
//
// Notification routing (Telegram-only — see lib/notify.ts for why):
//   1. Venue has registered chat_id → send TG message to venue + CC ops.
//   2. Venue has NOT registered     → send TG to ops with a 1-click
//      "Forward to venue via WhatsApp" deeplink in the message buttons.
//
// We persist nothing here. Dashboard previews come from the guest's
// localStorage. When Neon DB lands this route also inserts to `bookings`.

import { NextResponse } from "next/server";
import { getPlaceContact } from "@/lib/place-contacts";
import { sendTelegram, tgEscape } from "@/lib/notify";
import { saveBooking, kvReady } from "@/lib/storage";
import type { Booking } from "@/lib/booking";

const OPS_CHAT_ID = process.env.TELEGRAM_OPS_CHAT_ID;

export const dynamic = "force-dynamic";

interface Body extends Partial<Booking> {
  placePhone?: string;
  placeWebsite?: string;
  placeMapsUrl?: string;
}

function digits(s: string | undefined): string {
  return (s || "").replace(/[^0-9]/g, "");
}

function buildVenueMessage(b: Body): string {
  // Telegram HTML — venue-facing. Sent when the venue has a chat_id.
  const guestWa = digits(b.guestPhone);
  return [
    `🆕 <b>New booking request</b>`,
    ``,
    `<b>${tgEscape(b.placeName)}</b>`,
    ``,
    `👤 <b>Guest:</b> ${tgEscape(b.guestName)} ${tgEscape(b.guestCountry || "")}`,
    `📧 ${tgEscape(b.guestEmail)}`,
    `📱 <a href="https://wa.me/${guestWa}">${tgEscape(b.guestPhone)}</a>  (tap to WhatsApp)`,
    ``,
    `📅 <b>${tgEscape(b.date)}${b.time ? "  " + tgEscape(b.time) : ""}</b>`,
    `👥 ${tgEscape(b.partySize)} guests`,
    b.notes ? `\n💬 <i>${tgEscape(b.notes)}</i>` : "",
    ``,
    `<i>Reference: ${tgEscape(b.id)}</i>`,
    `<i>Reply to this guest directly via WhatsApp or email — Salaam Thailand takes no commission.</i>`,
  ].filter(Boolean).join("\n");
}

function buildOpsForwardMessage(b: Body, hasVenueChat: boolean): string {
  // Telegram HTML — ops-facing. Sent always (either as CC or as primary
  // when the venue hasn't registered). Includes a one-click WA forward link.
  const guestWa = digits(b.guestPhone);
  const placeWa = digits(b.placePhone);
  const forwardText = [
    `Salaam — Salaam Thailand here.`,
    `New booking for ${b.placeName}:`,
    ``,
    `Guest: ${b.guestName}`,
    `Date: ${b.date}${b.time ? " at " + b.time : ""}`,
    `Party: ${b.partySize}`,
    `WhatsApp: ${b.guestPhone}`,
    `Email: ${b.guestEmail}`,
    b.notes ? `\nNotes: ${b.notes}` : "",
    `\nRef: ${b.id}`,
  ].filter(Boolean).join("\n");

  const forwardWaUrl = placeWa ? `https://wa.me/${placeWa}?text=${encodeURIComponent(forwardText)}` : null;

  return [
    hasVenueChat ? `📋 <b>Booking CC</b> (venue already notified)` : `⚡ <b>ACTION — forward to venue</b>`,
    ``,
    `<b>${tgEscape(b.placeName)}</b> · ${tgEscape(b.placeCity || "")} · ${tgEscape(b.placeNiche || "")}`,
    ``,
    `👤 ${tgEscape(b.guestName)} ${tgEscape(b.guestCountry || "")}`,
    `📅 ${tgEscape(b.date)}${b.time ? "  " + tgEscape(b.time) : ""}  ·  👥 ${tgEscape(b.partySize)}`,
    `📧 ${tgEscape(b.guestEmail)}  ·  📱 <a href="https://wa.me/${guestWa}">${tgEscape(b.guestPhone)}</a>`,
    b.notes ? `\n💬 <i>${tgEscape(b.notes)}</i>` : "",
    ``,
    forwardWaUrl ? `👉 <a href="${tgEscape(forwardWaUrl)}">Forward via WhatsApp</a>` : "",
    b.placeMapsUrl ? `🗺 <a href="${tgEscape(b.placeMapsUrl)}">Maps</a>` : "",
    b.placeWebsite ? `🔗 <a href="${tgEscape(b.placeWebsite)}">Website</a>` : "",
    ``,
    `<i>Ref: ${tgEscape(b.id)}</i>`,
  ].filter(Boolean).join("\n");
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.guestName || !body.guestEmail || !body.guestPhone || !body.date || !body.placeName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const contact = body.placeId ? getPlaceContact(body.placeId) : null;
  const venueChatId = contact?.telegramChatId;
  const hasVenueChat = !!venueChatId;

  // Persist to KV first so the dashboard/admin can see it even if every
  // notification path fails. Make it best-effort so a KV outage doesn't
  // block the user — we still confirm and the guest's localStorage acts
  // as a last-resort record.
  const fullBooking: Booking = {
    id: body.id || `BK-${Date.now()}`,
    placeId: body.placeId || "",
    placeName: body.placeName || "",
    placeNiche: body.placeNiche || "",
    placeCity: body.placeCity || "",
    guestName: body.guestName || "",
    guestEmail: body.guestEmail || "",
    guestPhone: body.guestPhone || "",
    guestCountry: body.guestCountry,
    date: body.date || "",
    time: body.time,
    partySize: body.partySize || 1,
    notes: body.notes,
    status: "pending",
    channel: "salaam-thailand",
    createdAt: body.createdAt || new Date().toISOString(),
  };

  const sends: Array<Promise<unknown>> = [];

  if (kvReady()) {
    sends.push(
      saveBooking(fullBooking).catch((e) => {
        console.error("[booking] KV save failed:", e);
      })
    );
  }
  if (hasVenueChat) {
    sends.push(sendTelegram(venueChatId, buildVenueMessage(body)));
  }
  if (OPS_CHAT_ID) {
    sends.push(sendTelegram(OPS_CHAT_ID, buildOpsForwardMessage(body, hasVenueChat)));
  }

  await Promise.allSettled(sends);

  return NextResponse.json({
    ok: true,
    id: fullBooking.id,
    routedTo: hasVenueChat ? "venue+ops" : "ops-forward",
    persisted: kvReady(),
  });
}
