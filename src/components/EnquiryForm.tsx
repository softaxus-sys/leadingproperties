"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

/**
 * There is no backend yet, so an enquiry is handed to WhatsApp or the visitor's email
 * client with the details pre-filled. When enquiries should land in Vrodux CRM as leads,
 * replace `send` with a POST to a server route that relays to the CRM inbound URL
 * (keep that URL server-side — its key is the only thing protecting the endpoint).
 */
export function EnquiryForm({ subject }: { subject?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);

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

  const send = (channel: "whatsapp" | "email") => {
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError("Please enter your name and a phone number or email.");
      return;
    }
    setError(null);
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
        <button type="submit" className="btn bg-[#25D366] text-white hover:bg-[#1eb957]">
          <MessageCircle className="h-4 w-4" aria-hidden /> Send on WhatsApp
        </button>
        <button type="button" className="btn-dark" onClick={() => send("email")}>
          <Mail className="h-4 w-4" aria-hidden /> Send by Email
        </button>
      </div>
    </form>
  );
}
