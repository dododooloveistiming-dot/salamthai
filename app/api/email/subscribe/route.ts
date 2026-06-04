import { NextResponse } from "next/server";
import { addSubscriber, isValid, normalize } from "@/lib/email-list";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; name?: string; country?: string; source?: string; lang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = normalize(body.email || "");
  if (!isValid(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const result = await addSubscriber({
    email,
    name: (body.name || "").slice(0, 80),
    country: (body.country || "").slice(0, 60),
    source: (body.source || "unknown").slice(0, 40),
    lang: (body.lang || "en").slice(0, 5),
    subscribed_at: new Date().toISOString(),
  });

  if (result.already) {
    return NextResponse.json({ ok: true, already: true });
  }
  return NextResponse.json({ ok: true, added: true });
}
