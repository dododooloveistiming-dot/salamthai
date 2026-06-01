// Telegram bot notifications — used by /api/booking/submit and any future
// notification path. We picked Telegram over Resend because (a) free forever,
// (b) push to phone in <1s, (c) zero per-message cost as we scale.
//
// Setup (one-time):
//   1. Open Telegram → search @BotFather → /newbot → follow prompts
//      → receive BOT_TOKEN (looks like "1234567890:ABC-DEF...")
//   2. Search for your new bot → /start
//   3. Visit https://api.telegram.org/bot{BOT_TOKEN}/getUpdates → find your
//      "chat":{"id":NNN} — that's your OPS chat id (numeric, can be negative)
//   4. Vercel → Settings → Environment Variables:
//        TELEGRAM_BOT_TOKEN    = the token from step 1
//        TELEGRAM_OPS_CHAT_ID  = the chat id from step 3
//   5. Redeploy.
//
// To onboard a venue (later): they DM the same bot /register <place-slug>,
// the bot records their chat_id in lib/place-contacts.ts (or DB) and
// subsequent bookings route to them directly.

const TG_API = "https://api.telegram.org";

export interface TelegramSendResult {
  ok: boolean;
  to: string;
  skipped?: boolean;
  reason?: string;
}

export async function sendTelegram(
  chatId: string | number | undefined,
  text: string,
  opts?: { parseMode?: "HTML" | "Markdown" | "MarkdownV2"; disableLinkPreview?: boolean }
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log("[notify] (no TELEGRAM_BOT_TOKEN) →", String(chatId), text.slice(0, 120));
    return { ok: false, to: String(chatId), skipped: true, reason: "no_token" };
  }
  if (!chatId) {
    return { ok: false, to: "", skipped: true, reason: "no_chat_id" };
  }

  try {
    const r = await fetch(`${TG_API}/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: opts?.parseMode ?? "HTML",
        disable_web_page_preview: opts?.disableLinkPreview ?? true,
      }),
    });
    if (!r.ok) {
      const body = await r.text();
      console.error("[notify] telegram send failed:", r.status, body);
      return { ok: false, to: String(chatId), reason: `http_${r.status}` };
    }
    return { ok: true, to: String(chatId) };
  } catch (e) {
    console.error("[notify] telegram exception:", e);
    return { ok: false, to: String(chatId), reason: "exception" };
  }
}

// HTML escape for Telegram parse_mode="HTML"
export function tgEscape(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
