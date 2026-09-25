"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

export function EnquiryForm({ subject }: { subject?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  const submitLead = async () => {
    try {
      await fetch("/api/lead", {
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
    } catch {
      // Non-blocking: the enquiry still reaches us via WhatsApp/email below.
    }
  };

  const send = async (channel: "whatsapp" | "email") => {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError("Please enter your name and a phone number or email.");
      return;
    }
    setError(null);
    setSubmitting(true);
    await submitLead();
    setSubmitting(false);
    const url =
      channel === "whatsapp"
        ? whatsappLink(site.contact.whatsapp, body())
        : `mailto:${site.contact.email}?subject=${encodeURIComponent(subject ?? "Website enquiry")}&body=${encodeURIComponent(body())}`;
    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener");
  };

  return (
    <form className="space-y-3" onSubmit={(e) => (e.preventDefault(), send("whatsapp"))} noValidate>
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
        <button type="submit" disabled={submitting} className="btn bg-[#25D366] text-white hover:bg-[#1eb957] disabled:opacity-60">
          <MessageCircle className="h-4 w-4" aria-hidden /> Send on WhatsApp
        </button>
        <button type="button" disabled={submitting} className="btn-dark disabled:opacity-60" onClick={() => send("email")}>
          <Mail className="h-4 w-4" aria-hidden /> Send by Email
        </button>
      </div>
    </form>
  );
}
