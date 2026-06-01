// POST /api/bookings/status
//   body: { id: string, status: "pending"|"confirmed"|"declined"|"cancelled" }
//
// Updates the booking status. Used by the owner dashboard buttons (confirm,
// decline) and the cancel flow. Currently unauthenticated — Auth.js lands
// alongside DB migration; the admin password gate + robots:noindex are
// the temporary safeguards.

import { NextResponse } from "next/server";
import { updateBookingStatus, kvReady } from "@/lib/storage";
import type { BookingStatus } from "@/lib/booking";

const ALLOWED: BookingStatus[] = ["pending", "confirmed", "declined", "cancelled"];

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!kvReady()) {
    return NextResponse.json({ error: "kv_not_configured" }, { status: 503 });
  }

  let body: { id?: string; status?: string };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (!body.id || !body.status || !ALLOWED.includes(body.status as BookingStatus)) {
    return NextResponse.json({ error: "Invalid id/status" }, { status: 400 });
  }

  try {
    const updated = await updateBookingStatus(body.id, body.status as BookingStatus);
    if (!updated) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, booking: updated });
  } catch (e) {
    console.error("[bookings/status]", e);
    return NextResponse.json({ error: "kv_write_failed" }, { status: 500 });
  }
}
