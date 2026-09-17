import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/content";

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12V9.77a5.7 5.7 0 1 0 4.91 5.63V9.01a7.3 7.3 0 0 0 4.27 1.37V7.3a4.28 4.28 0 0 1-3.21-1.48z" />
    </svg>
  );
}

export function Footer() {
  const { contact, social } = site;
  const socials = [
    { href: social.facebook, label: "Facebook", Icon: Facebook },
    { href: social.instagram, label: "Instagram", Icon: Instagram },
    { href: social.tiktok, label: "TikTok", Icon: TikTok },
    { href: social.linkedin, label: "LinkedIn", Icon: Linkedin },
  ];

  return (
    <footer className="bg-ink text-zinc-300">
      <div className="container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="inline-block rounded-md bg-white p-3">
            <Image src="/images/brand/logo.png" alt={site.name} width={170} height={44} />
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed">
            {site.description}
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-full border border-zinc-700 p-2.5 transition hover:border-brand hover:text-brand"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["Properties for Rent", "/properties?purpose=rent"],
              ["Properties for Sale", "/properties?purpose=sale"],
              ["New Projects", "/projects"],
              ["About Us", "/about"],
              ["Contact Us", "/contact"],
              ["Privacy Policy", "/privacy-policy"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact Us</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <a href={`tel:${contact.phone}`} dir="ltr" className="hover:text-white">
                {contact.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              <span>{contact.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="container py-5 text-xs text-zinc-500">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
