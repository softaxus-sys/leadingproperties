import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, KeyRound, LineChart, MapPin, ShieldCheck, Star } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeading } from "@/components/SectionHeading";
import { getProjects, site, team } from "@/lib/content";
import { filterOptions, getFeaturedListings, getListings } from "@/lib/listings";

export const revalidate = 300;

const popularSearches = [
  ["Apartments for rent in Business Bay", "/properties?purpose=rent&community=Business Bay"],
  ["Apartments for rent in Downtown Dubai", "/properties?purpose=rent&community=Downtown Dubai"],
  ["Offices for rent in Business Bay", "/properties?purpose=rent&category=commercial&community=Business Bay"],
  ["Homes for sale in Dubai Marina", "/properties?purpose=sale&community=Dubai Marina"],
  ["Villas for sale in Dubai Hills Estate", "/properties?purpose=sale&community=Dubai Hills Estate"],
  ["Commercial property for sale", "/properties?purpose=sale&category=commercial"],
];

/** The red triangle from the logo's "A", reused as a graphic accent. */
function Peak({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <polygon points="50,0 100,100 0,100" fill="currentColor" />
    </svg>
  );
}

export default async function HomePage() {
  const [all, featured] = await Promise.all([getListings(), getFeaturedListings(6)]);
  const { types, communities } = filterOptions(all);
  const projects = getProjects().filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* Hero: black text panel beside a photo cut on the same slant as the logo's "A" */}
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-y-0 right-0 hidden w-[55%] lg:block" style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}>
          <Image src="/images/site/hero.webp" alt="" fill priority sizes="55vw" className="object-cover" />
          <div className="absolute inset-y-0 left-0 w-[22%] bg-brand" style={{ clipPath: "polygon(100% 0, 100% 3%, 3% 100%, 0 100%)" }} aria-hidden />
        </div>
        <div className="container relative pb-14 pt-20 md:pt-28 lg:pb-24">
          <div className="lg:max-w-[52%]">
            <p className="eyebrow">{site.tagline}</p>
            <h1 className="mt-5 text-4xl font-extrabold uppercase leading-[1.05] text-white md:text-6xl">
              Find the Dubai address that <span className="text-brand">fits your life</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-zinc-400">
              Homes, offices and off-plan opportunities, matched to how you want to live and invest. Guided by a team
              that has worked this market for {site.yearsInBusiness}+ years.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties?purpose=sale" className="btn bg-brand text-white hover:bg-brand-dark">Buy a property</Link>
              <Link href="/properties?purpose=rent" className="btn border-2 border-white text-white hover:bg-white hover:text-ink">Rent a property</Link>
            </div>
          </div>
          <div className="relative mt-14 max-w-5xl lg:mt-20">
            <SearchBar types={types} communities={communities} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white">
        <dl className="container grid grid-cols-2 divide-zinc-200 py-10 text-center md:grid-cols-4 md:divide-x">
          {[
            [`${site.yearsInBusiness}+`, "Years in Dubai"],
            [`${all.length}+`, "Live listings"],
            [`${site.developers.length}`, "Developer partners"],
            [`${site.reviews.count}`, `${site.reviews.source} reviews`],
          ].map(([value, label]) => (
            <div key={label} className="flex flex-col-reverse py-2">
              <dt className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-muted">{label}</dt>
              <dd className="font-display text-3xl font-extrabold text-ink md:text-4xl">
                {value}
                <span className="mx-auto mt-2 block h-1 w-8 bg-brand" aria-hidden />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Handpicked listings */}
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Handpicked for you"
              title="Featured Properties"
              text="A curated shortlist chosen for location, lifestyle and long-term value."
            />
            <Link href="/properties" className="btn-outline">
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Off-plan */}
      <section className="section bg-ink text-white">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">Off-plan launches</p>
              <h2 className="mt-2 text-3xl font-extrabold uppercase md:text-4xl">New Projects</h2>
              <p className="mt-3 text-zinc-400">New launches from the city&apos;s leading developers, with flexible payment plans.</p>
            </div>
            <Link href="/projects" className="btn-primary">
              All projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-zinc-900">
                <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 border-b-4 border-brand p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand">{p.developer}</p>
                  <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-zinc-300">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden /> {p.location}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider">
                    View project <ArrowUpRight className="h-4 w-4 text-brand" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full border-4 border-brand" aria-hidden />
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src="/images/site/about.jpg" alt="Dubai skyline" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-6 right-6 bg-ink px-6 py-4 text-white">
              <div className="flex gap-0.5 text-brand" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-1 text-sm font-semibold">
                {site.reviews.count} {site.reviews.source} reviews
              </p>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Leading Properties"
              title="One team for renting, buying and investing"
              text="We keep one of Dubai's largest apartment inventories and pair it with honest, straightforward advice."
            />
            <div className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
              {[
                { Icon: KeyRound, title: "Move in with less friction", text: "Viewings, negotiation, contracts and Ejari handled end to end." },
                { Icon: LineChart, title: "Invest with clear numbers", text: "Rental yields, service charges and payment plans laid out before you commit." },
                { Icon: ShieldCheck, title: "Transparent from first call to handover", text: "No hidden fees, and every document checked twice." },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex gap-4 py-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-brand text-white">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-dark mt-8">
              About us <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section bg-paper-dark">
        <div className="container">
          <SectionHeading align="center" eyebrow="Client stories" title="What Our Clients Say" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {site.reviews.items.map((r) => (
              <figure key={r.author} className="flex flex-col border-l-4 border-brand bg-white p-7">
                <div className="flex gap-0.5 text-brand" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">“{r.text}”</blockquote>
                <figcaption className="mt-6 text-sm font-bold uppercase tracking-wider">{r.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Our people" title="Meet the Team" text="Seasoned agents who know every Dubai community inside out." />
            <Link href="/about#team" className="btn-outline">
              Full team <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {team.slice(0, 6).map((m) => (
              <div key={m.name} className="group">
                <div className="relative aspect-[3/4] overflow-hidden border-b-4 border-ink bg-zinc-100 transition group-hover:border-brand">
                  <Image src={m.image} alt={m.name} fill sizes="(min-width: 1024px) 16vw, 50vw" className="object-cover grayscale transition group-hover:grayscale-0" />
                </div>
                <p className="mt-3 text-sm font-bold">{m.name}</p>
                <p className="text-xs text-ink-muted">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="border-y border-zinc-200 bg-white py-12">
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Our developer partners</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {site.developers.map((d) => (
              <div
                key={d.name}
                title={d.name}
                className="group flex h-24 items-center justify-center border border-zinc-200 bg-white px-4 transition duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-[0_8px_24px_-8px_rgba(225,37,27,0.45)]"
              >
                <div className="relative h-12 w-full">
                  <Image
                    src={d.logo}
                    alt={d.name}
                    fill
                    sizes="150px"
                    className="object-contain opacity-50 grayscale transition duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular searches */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Popular searches" title="Quick Searches" />
          <div className="mt-8 grid gap-px bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {popularSearches.map(([label, href]) => (
              <Link key={href} href={href} className="group flex items-center justify-between bg-white px-5 py-4 text-sm font-semibold transition hover:bg-ink hover:text-white">
                {label}
                <ArrowRight className="h-4 w-4 text-brand" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Peak className="absolute -right-16 -top-10 -z-10 h-72 w-72 text-brand/25" />
        <div className="container flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold uppercase md:text-4xl">Ready for your next move?</h2>
            <p className="mt-2 text-zinc-400">Tell us what you need and an advisor will get back to you shortly.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Book a consultation <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn bg-white text-ink hover:bg-zinc-200">
              WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
