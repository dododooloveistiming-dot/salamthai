// Per-venue contact registry. When a venue claims its listing on Salaam
// Thailand it provides an email + WhatsApp, which routes booking requests
// directly to them. This file is the mock for that — once we have a real
// Neon/Drizzle setup we read this from the `place_contacts` table instead.
//
// Lookup by place slug. Missing entries fall back to operator-only routing
// (thaiconnect33@gmail.com receives the booking, then forwards manually via
// the WhatsApp / Maps deeplinks rendered in the email).

export interface PlaceContact {
  telegramChatId?: string | number;  // primary — venue receives push instantly
  email?: string;                     // optional backup
  whatsapp?: string;                  // E.164 digits only (e.g. "66812345678")
  preferredChannel?: "telegram" | "email" | "whatsapp";
  ownerName?: string;
}

export const PLACE_CONTACTS: Record<string, PlaceContact> = {
  // Examples — real entries get added when each venue claims their listing
  // and DMs the Salaam bot /register <slug>:
  //   "al-meroz-hotel":          { telegramChatId: 123456789, whatsapp: "66811234567", ownerName: "Ahmed Hassan" },
  //   "yana-halal-restaurant":   { telegramChatId: 987654321, email: "info@yanahalal.com" },
};

export function getPlaceContact(slug: string): PlaceContact | null {
  return PLACE_CONTACTS[slug] ?? null;
}
