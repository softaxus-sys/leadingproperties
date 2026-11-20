import Image from "next/image";
import { ChevronDown, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  PAGE_PATH, communityFeatures, disclaimer, faqs, gallery, images, payment,
  project, residences, stats, whatsappMessage, whySix,
} from "@/data/greenwood";
import { Gallery } from "@/components/Gallery";
import { LeadForm } from "@/components/greenwood/LeadForm";
import { PaymentCalculator } from "@/components/greenwood/PaymentCalculator";
import { AttributionCapture, TrackedLink } from "@/components/greenwood/TrackedLink";
import { site, siteUrl } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

const h2 = "font-serif text-5xl font-medium leading-[1.02] tracking-tight md:text-7xl";
const pad = "py-24 md:py-32";

export default function GreenwoodPage() {
  const waHref = whatsappLink(process.env.NEXT_PUBLIC_GREENWOOD_WHATSAPP || site.contact.whatsapp, whatsappMessage);
  const pageUrl = `${siteUrl}${PAGE_PATH}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: "Greenwood by Aldar | Dubai Silicon Oasis",
        inLanguage: "en-AE",
        isPartOf: { "@type": "WebSite", name: site.name, url: siteUrl },
        about: { "@type": "Place", name: "Dubai Silicon Oasis", address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" } },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="overflow-x-clip bg-gw-night text-gw-sand">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AttributionCapture />

      {/* Hero */}
      <section className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden">
        <Image src={images.hero} alt="Representative image of a landscaped waterside park with townhouses" fill priority sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gw-night/95 via-gw-night/65 to-gw-night/25" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-gw-night to-transparent" />
        <div className="container grid items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="gw-rise">
            <h1 className="font-serif text-[clamp(3.75rem,9.5vw,8rem)] font-medium leading-[0.88] tracking-tight text-white">
              Aldar<br />Greenwood
            </h1>
            <p className="mt-7 max-w-md text-xl leading-relaxed text-gw-sand/90">Townhouses and villas by Aldar Properties in Dubai Silicon Oasis.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <TrackedLink href="#register" location="hero" className="gw-btn-gold">Register for priority access</TrackedLink>
              <TrackedLink href="#residences" location="hero" className="gw-btn-ghost">See the homes</TrackedLink>
            </div>
          </div>
          <div className="gw-rise rounded-sm bg-gw-sand p-6 text-gw-night shadow-2xl [animation-delay:150ms] md:p-7">
            <h2 className="font-serif text-3xl font-semibold">Register your interest</h2>
            <p className="mb-5 mt-1 text-sm text-gw-night/70">Project details, floor plans and pricing, first.</p>
            <LeadForm variant="hero" source="hero-form" />
          </div>
        </div>
        <p className="absolute bottom-3 left-4 text-xs text-gw-sand/70 sm:left-8">Representative imagery. Information is preliminary and subject to developer confirmation.</p>
      </section>

      {/* Facts */}
      <section id="overview" className="scroll-mt-24 bg-gw-deep">
        <div className="container">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-2 py-10 sm:px-6 ${i % 2 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-white/10" : ""}`}>
                <dd className="font-serif text-6xl font-medium text-gw-gold md:text-7xl">{s.value}</dd>
                <dt className="mt-2 text-sm text-gw-sand/75">{s.label}</dt>
              </div>
            ))}
          </dl>
          <p className="pb-6 text-xs text-gw-sand/50">Preliminary figures, subject to developer confirmation.</p>
        </div>
      </section>

      {/* Aldar and the community */}
      <section className={pad}>
        <div className="container grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
          <div>
            <h2 className={h2}>Aldar&apos;s next community, built around green space</h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-gw-sand/80">
              Greenwood is planned as a master community in Dubai Silicon Oasis, developed by Aldar Properties with Dubai Holding. Homes sit among parks, close to retail, schools and workplaces.
            </p>
            <ol className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {whySix.map((w, i) => (
                <li key={w.title} className="border-t border-white/15 pt-4">
                  <span className="font-serif text-2xl text-gw-gold">0{i + 1}</span>
                  <h3 className="mt-1 text-lg font-semibold text-white">{w.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gw-sand/70">{w.text}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-xs text-gw-sand/50">No rental yields, capital appreciation or returns are promised or guaranteed.</p>
          </div>
          <div className="relative">
            <div className="absolute -bottom-5 -right-5 h-full w-full border border-gw-gold/50" aria-hidden />
            <div className="relative aspect-[4/5] overflow-hidden bg-gw-forest">
              <Image src={images.overview} alt="Contemporary residences overlooking green open space" fill loading="lazy" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              <span className="absolute bottom-3 left-3 rounded-sm bg-black/60 px-2 py-1 text-xs text-white">Representative imagery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Residences */}
      <section id="residences" className={`scroll-mt-24 bg-gw-sand text-gw-night ${pad}`}>
        <div className="container">
          <h2 className={`${h2} max-w-4xl`}>Six homes, three to five bedrooms</h2>
          <p className="mt-6 max-w-xl text-lg text-gw-night/70">Floor areas, layouts and prices come from the developer once released. Ask for the floor plan of the one you like.</p>
          <ul className="mt-14 border-t border-gw-night/80">
            {residences.map((r) => (
              <li key={r.title} className="grid items-center gap-x-10 gap-y-3 border-b border-gw-night/20 py-7 transition-colors hover:bg-white/50 md:grid-cols-[130px_1.3fr_1fr_auto]">
                <span className="font-serif text-8xl font-medium leading-none text-gw-gold-deep" aria-hidden>{r.beds}</span>
                <div>
                  <h3 className="font-serif text-3xl font-semibold">{r.title}</h3>
                  <p className="mt-1 text-sm text-gw-night/70">{r.blurb}</p>
                </div>
                <p className="text-sm text-gw-night/70">Price on request. Ask for current availability.</p>
                <TrackedLink href="#register" location="residence-row" propertyType={r.option} className="gw-btn-dark !py-3 !text-sm">Request floor plan</TrackedLink>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gw-night/55">Unit types are indicative and subject to developer confirmation.</p>
        </div>
      </section>

      {/* Lifestyle and gallery */}
      <section id="lifestyle" className={`scroll-mt-24 bg-gw-forest ${pad}`}>
        <div className="container grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className={h2}>More than homes. A complete community.</h2>
            <p className="mt-8 text-lg leading-relaxed text-gw-sand/85">Homes, workplaces, shops, schools and everyday essentials, surrounded by green space to move, breathe and recharge.</p>
            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {communityFeatures.map((t) => (
                <li key={t} className="border-t border-white/20 py-3 text-gw-sand">{t}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-gw-sand/55">Planned features, not guaranteed completed facilities, until confirmed by the developer.</p>
          </div>
          <div>
            <Gallery images={gallery.map((g) => g.src)} alt="Representative community imagery" />
            <p className="mt-3 text-xs text-gw-sand/60">Representative imagery of landscaped communities, not approved Greenwood renders.</p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className={`scroll-mt-24 ${pad}`}>
        <div className="container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className={h2}>Dubai Silicon Oasis</h2>
            <p className="mt-6 flex items-center gap-2 text-gw-sand/80"><MapPin className="h-5 w-5 text-gw-gold" aria-hidden /> {project.location}</p>
            <ul className="mt-10 border-t border-white/20">
              {["Academic City nearby", "Surrounding residential communities", "Major road connectivity", "Dubai Metro Blue Line, planned"].map((t) => (
                <li key={t} className="border-b border-white/10 py-4 text-lg">{t}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-gw-sand/60">The Blue Line is planned infrastructure for the wider area. We have not verified walking distances to any station.</p>
            <TrackedLink href={project.mapUrl} target="_blank" rel="noopener noreferrer" location="location" className="gw-btn-ghost mt-8">Open in Google Maps</TrackedLink>
          </div>
          <div className="overflow-hidden rounded-sm border border-white/15">
            <iframe
              title="Map of the project location in Dubai Silicon Oasis"
              src={`https://maps.google.com/maps?q=${project.lat},${project.lng}&z=14&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full border-0 grayscale-[0.5] lg:h-full lg:min-h-[480px]"
            />
          </div>
        </div>
      </section>

      {/* Payment plan */}
      <section id="payment-plan" className={`scroll-mt-24 bg-gw-sand text-gw-night ${pad}`}>
        <div className="container">
          <p className="font-serif text-[clamp(7rem,24vw,19rem)] font-medium leading-[0.8] tracking-tight text-gw-forest">
            {payment.duringConstruction}/{payment.onHandover}
          </p>
          <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="font-serif text-4xl font-medium leading-tight md:text-6xl">The expected payment plan</h2>
              <p className="mt-6 max-w-md text-lg text-gw-night/75">{payment.duringConstruction}% during construction, {payment.onHandover}% on handover, around {payment.booking}% to book. Indicative prices start near AED 3 million for selected homes.</p>
              <TrackedLink href="#register" location="payment-plan" className="gw-btn-dark mt-8">Request the latest price list</TrackedLink>
              <p className="mt-6 max-w-md text-xs text-gw-night/60">All prices, payment schedules, booking amounts and availability are indicative and subject to developer confirmation. Instalment dates and construction milestones have not been published.</p>
            </div>
            <PaymentCalculator />
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className={`scroll-mt-24 bg-gw-forest ${pad}`}>
        <div className="container grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className={h2}>Be among the first to see Aldar Greenwood</h2>
            <p className="mt-6 max-w-md text-lg text-gw-sand/85">Leave your details for project updates, pricing and launch information. No obligation.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <TrackedLink kind="whatsapp" location="register" href={waHref} target="_blank" rel="noopener noreferrer" className="gw-btn bg-[#25D366] text-white hover:bg-[#1eb957]">
                <MessageCircle className="h-5 w-5" aria-hidden /> Enquire on WhatsApp
              </TrackedLink>
              <TrackedLink kind="call" location="register" href={`tel:${site.contact.phone}`} className="gw-btn-ghost">
                <Phone className="h-5 w-5" aria-hidden /> <span dir="ltr">{site.contact.phoneDisplay}</span>
              </TrackedLink>
            </div>
          </div>
          <div className="rounded-sm bg-gw-sand p-6 text-gw-night shadow-2xl md:p-9">
            <LeadForm variant="full" source="register-section" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className={`scroll-mt-24 ${pad}`}>
        <div className="container max-w-3xl">
          <h2 className={h2}>Questions, answered plainly</h2>
          <div className="mt-12 divide-y divide-white/15 border-y border-white/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-2xl font-medium text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-gw-gold transition group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 leading-relaxed text-gw-sand/75">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-10 text-xs leading-relaxed text-gw-sand/50">{disclaimer}</p>
        </div>
      </section>
    </div>
  );
}
