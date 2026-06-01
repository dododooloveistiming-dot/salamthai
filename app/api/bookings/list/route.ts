// GET /api/bookings/list?placeId=xxx
//
// Returns the booking list for one venue (owner dashboard) — or for ALL
// venues when placeId is omitted (admin overview).
//
// No auth gating yet — that lands when Auth.js is wired up. For now relying
// on robots:noindex + the AdminGate password on /admin/.

import { NextResponse } from "next/server";
import { listAllBookings, listBookingsForPlace, kvReady } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!kvReady()) {
    return NextResponse.json({ bookings: [], kv: false });
  }

  const url = new URL(req.url);
  const placeId = url.searchParams.get("placeId");
  const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 500);

  try {
    const bookings = placeId
      ? await listBookingsForPlace(placeId, limit)
      : await listAllBookings(limit);
    return NextResponse.json({ bookings, kv: true });
  } catch (e) {
    console.error("[bookings/list]", e);
    return NextResponse.json({ bookings: [], kv: true, error: "kv_read_failed" }, { status: 500 });
  }
}
