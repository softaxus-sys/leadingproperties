"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircle, Send } from "lucide-react";
import { site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

/**
 * Enquiries go straight into Vrodux CRM through /api/lead, which relays to the CRM webhook
 * server-side. Nothing depends on the visitor's own email app. WhatsApp stays as an option for
 * people who prefer to chat; that enquiry is saved in the CRM first as well.
 */
export function EnquiryForm({ subject }: { subject?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const body = () =>
    [
      subject ? `Enquiry: ${subject}` : "Website enquiry",
      `Name: ${form.name}`,
      form.phone && `Phone: ${form.phone}`,
      form.email && `Email: ${form.email}`,
      form.message && `\n${form.message}`,
    ]
      .filter(Boolean)
      .join("\n");

  /** True when the CRM accepted the enquiry. */
  const submitLead = async () => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          interested_in: subject ?? "",
        }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const valid = () => {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError("Please enter your name and a phone number or email.");
      return false;
    }
    setError(null);
    return true;
  };

  const sendEnquiry = async () => {
    if (!valid()) return;
    setSubmitting(true);
    const ok = await submitLead();
    setSubmitting(false);
    if (ok) setSent(true);
    else
      setError(
        `Sorry, we couldn't send your enquiry just now. Please try again, call us on ${site.contact.phoneDisplay}, or message us on WhatsApp.`,
      );
  };

  const sendWhatsApp = async () => {
    if (!valid()) return;
    // Open the window before awaiting, or browsers treat it as a pop-up and block it.
    const win = window.open("", "_blank");
    setSubmitting(true);
    await submitLead(); // saved in the CRM too; the chat goes ahead even if this fails
    setSubmitting(false);
    const url = whatsappLink(site.contact.whatsapp, body());
    if (win) win.location.href = url;
    else window.location.href = url;
  };

  if (sent) {
    return (
      <div role="status" className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600" aria-hidden />
        <h3 className="mt-3 text-lg font-bold">Thank you, {form.name.split(" ")[0]}!</h3>
        <p className="mt-1 text-sm text-ink-soft">
          We&apos;ve received your enquiry and an advisor will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-3" onSubmit={(e) => (e.preventDefault(), sendEnquiry())} noValidate>
      <div>
        <label htmlFor="enq-name" className="mb-1 block text-sm font-medium">Full name *</label>
        <input id="enq-name" className="field" value={form.name} onChange={set("name")} autoComplete="name" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="enq-phone" className="mb-1 block text-sm font-medium">Phone</label>
          <input id="enq-phone" type="tel" dir="ltr" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+971" />
        </div>
        <div>
          <label htmlFor="enq-email" className="mb-1 block text-sm font-medium">Email</label>
          <input id="enq-email" type="email" className="field" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="enq-msg" className="mb-1 block text-sm font-medium">Message</label>
        <textarea id="enq-msg" rows={4} className="field" value={form.message} onChange={set("message")} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-brand">
          {error}
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          <Send className="h-4 w-4" aria-hidden /> {submitting ? "Sending…" : "Send enquiry"}
        </button>
        <button type="button" disabled={submitting} className="btn bg-[#25D366] text-white hover:bg-[#1eb957] disabled:opacity-60" onClick={sendWhatsApp}>
          <MessageCircle className="h-4 w-4" aria-hidden /> Chat on WhatsApp
        </button>
      </div>
    </form>
  );
}
