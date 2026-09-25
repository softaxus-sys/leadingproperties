import { NextRequest, NextResponse } from "next/server";

/**
 * Relays enquiry-form submissions to the Vrodux CRM inbound webhook (Option B:
 * "POST directly from your backend"). The webhook URL is the secret here — it
 * must stay server-side, so the browser posts to this route instead of Vrodux directly.
 */

const ALLOWED_FIELDS = [
  "first_name",
  "last_name",
  "name",
  "email",
  "phone",
  "whatsapp",
  "company",
  "title",
  "city",
  "country",
  "interested_in",
  "budget",
  "message",
  "campaign",
] as const;

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.VRODUX_LEAD_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "Lead webhook not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const payload: Record<string, string> = {};
  for (const key of ALLOWED_FIELDS) {
    const value = (body as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) payload[key] = value.trim();
  }
  if (!payload.email && !payload.phone && !payload.whatsapp) {
    return NextResponse.json({ error: "Provide an email or phone number" }, { status: 400 });
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "CRM rejected the lead" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
