"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { CAMPAIGN, propertyOptions } from "@/data/greenwood";
import { COUNTRIES, DEFAULT_COUNTRY, POPULAR_COUNT, countryByIso } from "@/data/countries";
import { getAttribution, track } from "@/lib/greenwood-track";


const PURPOSES = ["End Use", "Investment", "Both"];
const BUDGETS = ["Below AED 2.5M", "AED 2.5M–3M", "AED 3M–4M", "AED 4M–5M", "Above AED 5M"];
const CONTACTS = ["WhatsApp", "Phone Call", "Email"];
const SENT_KEY = "gw_lead_sent";

type Variant = "hero" | "full";

const inputCls = "field focus:!border-gw-forest focus:!ring-gw-forest/20";
const labelCls = "mb-1 block text-sm font-medium";

export function LeadForm({ variant, source }: { variant: Variant; source: string }) {
  const id = useId();
  const full = variant === "full";
  const [f, setF] = useState({
    name: "", country: DEFAULT_COUNTRY, phone: "", email: "", type: "Not Decided",
    purpose: "", budget: "", contact: "WhatsApp", consent: false, website: "", // "website" is a honeypot
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | "sent" | "duplicate">(null);
  const lock = useRef(false);

  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((s) => ({ ...s, [k]: v }));

  // "Request Floor Plan" buttons on the cards preselect a property type.
  useEffect(() => {
    if (!full) return;
    const on = (e: Event) => {
      const t = (e as CustomEvent<{ type?: string }>).detail?.type;
      if (t && (propertyOptions as readonly string[]).includes(t)) setF((s) => ({ ...s, type: t }));
    };
    window.addEventListener("gw:prefill", on);
    return () => window.removeEventListener("gw:prefill", on);
  }, [full]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lock.current) return; // blocks double clicks while a request is in flight
    const digits = f.phone.replace(/\D/g, "").replace(/^0+/, "");
    if (!f.name.trim()) return setError("Please enter your full name.");
    if (digits.length < 6 || digits.length > 14) return setError("Please enter a valid mobile number.");
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) return setError("Please enter a valid email address.");
    if (!f.consent) return setError("Please confirm the privacy consent to continue.");
    setError(null);

    const fullPhone = `${countryByIso(f.country)[2]}${digits}`;
    // Same number registered recently from this browser: show success without creating a second lead.
    try {
      const prev = JSON.parse(localStorage.getItem(SENT_KEY) || "{}") as Record<string, number>;
      if (prev[fullPhone] && Date.now() - prev[fullPhone] < 24 * 3600 * 1000) return setDone("duplicate");
    } catch {
      /* storage blocked: skip the local duplicate check */
    }

    lock.current = true;
    setSubmitting(true);
    const a = getAttribution();
    const message = [
      `Aldar Greenwood (Dubai Silicon Oasis) enquiry [${source}]`,
      `Property type: ${f.type}`,
      f.purpose && `Purpose: ${f.purpose}`,
      f.budget && `Budget: ${f.budget}`,
      `Preferred contact: ${f.contact}`,
      `Landing page: ${a.landing_page ?? ""}`,
      a.referrer && `Referrer: ${a.referrer}`,
      `UTM source: ${a.utm_source ?? "-"}`,
      `UTM medium: ${a.utm_medium ?? "-"}`,
      `UTM campaign: ${a.utm_campaign ?? "-"}`,
      `UTM content: ${a.utm_content ?? "-"}`,
      `UTM term: ${a.utm_term ?? "-"}`,
      `gclid: ${a.gclid ?? "-"}`,
      `fbclid: ${a.fbclid ?? "-"}`,
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          phone: fullPhone,
          email: f.email,
          whatsapp: f.contact === "WhatsApp" ? fullPhone : "",
          interested_in: `Aldar Greenwood - ${f.type}`,
          budget: f.budget,
          message,
          campaign: a.utm_campaign || CAMPAIGN,
          website: f.website,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        const prev = JSON.parse(localStorage.getItem(SENT_KEY) || "{}");
        localStorage.setItem(SENT_KEY, JSON.stringify({ ...prev, [fullPhone]: Date.now() }));
      } catch {
        /* ignore */
      }
      track("generate_lead", { location: source, property_type: f.type, purpose: f.purpose, budget: f.budget });
      setDone("sent");
    } catch {
      setError("Sorry, we couldn't send your details just now. Please try again or message us on WhatsApp.");
    } finally {
      lock.current = false;
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-9 w-9 text-green-600" aria-hidden />
        <h3 className="mt-3 text-lg font-bold">Thank you, {f.name.trim().split(" ")[0]}</h3>
        <p className="mt-2 text-sm text-ink-soft">
          {done === "duplicate"
            ? "We already have your details. A property consultant will be in touch shortly."
            : "Your details have been received. A property consultant will contact you shortly with the latest project information."}
        </p>
      </div>
    );
  }

  const field = (n: string) => `${id}-${n}`;
  return (
    <form onSubmit={submit} noValidate className="space-y-3" aria-label="Register your interest">
      {/* Honeypot: hidden from people, tempting to bots. */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div>
        <label htmlFor={field("name")} className={labelCls}>Full Name</label>
        <input id={field("name")} className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" required />
      </div>
      <div>
        <label htmlFor={field("phone")} className={labelCls}>Mobile Number</label>
        <div className="flex gap-2">
          <select aria-label="Country code" className={`${inputCls} !w-[7.5rem] shrink-0`} value={f.country} onChange={(e) => set("country", e.target.value)}>
            <optgroup label="Popular">
              {COUNTRIES.slice(0, POPULAR_COUNT).map(([iso, name, dial]) => (
                <option key={iso} value={iso}>{dial} {name}</option>
              ))}
            </optgroup>
            <optgroup label="All countries">
              {COUNTRIES.slice(POPULAR_COUNT).map(([iso, name, dial]) => (
                <option key={iso} value={iso}>{dial} {name}</option>
              ))}
            </optgroup>
          </select>
          <input id={field("phone")} type="tel" inputMode="tel" dir="ltr" className={inputCls} value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel-national" required />
        </div>
      </div>
      <div>
        <label htmlFor={field("email")} className={labelCls}>Email Address</label>
        <input id={field("email")} type="email" className={inputCls} value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
      </div>
      <div>
        <label htmlFor={field("type")} className={labelCls}>Preferred Property Type</label>
        <select id={field("type")} className={inputCls} value={f.type} onChange={(e) => set("type", e.target.value)}>
          {propertyOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      {full && (
        <>
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor={field("purpose")} className={labelCls}>Purpose of Purchase</label>
              <select id={field("purpose")} className={inputCls} value={f.purpose} onChange={(e) => set("purpose", e.target.value)}>
                <option value="">Select</option>
                {PURPOSES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={field("budget")} className={labelCls}>Expected Budget</label>
              <select id={field("budget")} className={inputCls} value={f.budget} onChange={(e) => set("budget", e.target.value)}>
                <option value="">Select</option>
                {BUDGETS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={field("contact")} className={labelCls}>Preferred Contact Method</label>
            <select id={field("contact")} className={inputCls} value={f.contact} onChange={(e) => set("contact", e.target.value)}>
              {CONTACTS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
        <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-gw-forest" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} />
        <span>
          I agree to be contacted about this project and to the processing of my details in line with the{" "}
          <a href="/privacy-policy" target="_blank" rel="noopener" className="underline">Privacy Policy</a>.
        </span>
      </label>

      {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}

      <button type="submit" disabled={submitting} className="gw-btn-dark w-full disabled:opacity-60">
        {submitting ? "Sending…" : full ? "Request Project Details" : "Get Project Details"}
      </button>
      <p className="text-center text-xs text-ink-muted">
        Register your interest to receive project updates, floor plans and pricing information.
      </p>
    </form>
  );
}
