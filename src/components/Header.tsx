"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { nav, site } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} home`} className="shrink-0">
          <Image src="/images/brand/logo.png" alt={site.name} width={180} height={46} priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold hover:text-brand ${
                    isActive(item.href) ? "text-brand" : ""
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </Link>
                <div className="invisible absolute left-0 top-full w-48 rounded-md border border-zinc-200 bg-white py-2 opacity-0 shadow-lg transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block px-4 py-2 text-sm hover:bg-zinc-50 hover:text-brand">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-semibold hover:text-brand ${
                  isActive(item.href) ? "text-brand" : ""
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <a href={`tel:${site.contact.phone}`} className="btn-primary hidden lg:inline-flex">
          <Phone className="h-4 w-4" aria-hidden />
          <span dir="ltr">{site.contact.phoneDisplay}</span>
        </a>

        <button
          type="button"
          className="rounded-md p-2 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-zinc-200 bg-white lg:hidden" aria-label="Mobile">
          <div className="container flex flex-col py-3">
            {nav.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="block py-2.5 font-semibold">
                  {item.label}
                </Link>
                {item.children?.map((c) => (
                  <Link key={c.href} href={c.href} className="block py-2 pl-4 text-sm text-ink-soft">
                    {c.label}
                  </Link>
                ))}
              </div>
            ))}
            <a href={`tel:${site.contact.phone}`} className="btn-primary mt-3">
              <Phone className="h-4 w-4" aria-hidden />
              <span dir="ltr">{site.contact.phoneDisplay}</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
