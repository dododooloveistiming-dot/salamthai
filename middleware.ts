import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Injected-spam / hacked-WordPress leftover slugs that must be permanently
// dropped from search indexes. Returning 410 (Gone) makes crawlers remove them
// faster than a generic 404. The `config.matcher` below scopes this middleware
// to ONLY these exact paths, so it runs for essentially zero real traffic and
// adds no per-request edge cost to the rest of the site.
const GONE = new Set<string>([
  "/companies-with-zero-trust-network-security-explained",
]);

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/\/+$/, "");
  if (GONE.has(path)) {
    return new NextResponse(
      "410 Gone — this page has been permanently removed.",
      { status: 410, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/companies-with-zero-trust-network-security-explained",
    "/companies-with-zero-trust-network-security-explained/",
  ],
};
