import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Leading Properties in Business Bay, Dubai.",
};

export default function ContactPage() {
  const { contact } = site;
  const items = [
    { Icon: Phone, label: "Phone", value: contact.phoneDisplay, href: `tel:${contact.phone}`, ltr: true },
    { Icon: MessageCircle, label: "WhatsApp", value: `+${contact.whatsapp}`, href: whatsappLink(contact.whatsapp), ltr: true },
    { Icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}`, ltr: false },
    { Icon: MapPin, label: "Office", value: contact.address, href: null, ltr: false },
  ];

  return (
    <>
      <section className="bg-ink py-14 text-white">
        <div className="container">
          <p className="eyebrow">Keep in touch</p>
          <h1 className="mt-2 text-4xl font-extrabold">Contact Us</h1>
          <p className="mt-2 max-w-2xl text-zinc-300">
            Ready to buy, sell or invest in property? We&apos;re here to guide you every step of the way.
          </p>
        </div>
      </section>

      <section className="container grid gap-10 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">Have a question?</h2>
          <ul className="mt-6 space-y-5">
            {items.map(({ Icon, label, value, href, ltr }) => (
              <li key={label} className="flex gap-4">
                <span className="rounded-full bg-brand-light p-3 text-brand">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
                  {href ? (
                    <a href={href} dir={ltr ? "ltr" : undefined} className="font-semibold hover:text-brand" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200">
            <iframe
              title="Leading Properties office location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(contact.mapQuery)}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="rounded-lg border border-zinc-200 p-6 lg:self-start">
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="mb-5 mt-1 text-sm text-ink-muted">We usually reply within one business day.</p>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}
