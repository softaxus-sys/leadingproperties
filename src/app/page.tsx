import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Building2, Handshake, Star } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeading } from "@/components/SectionHeading";
import { getProjects, site, team } from "@/lib/content";
import { filterOptions, getFeaturedListings, getListings } from "@/lib/listings";

export const revalidate = 300;

export default async function HomePage() {
  const [all, featured] = await Promise.all([getListings(), getFeaturedListings(6)]);
  const { types, communities } = filterOptions(all);
  const projects = getProjects().filter((p) => p.featured).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image src="/images/site/hero.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="container py-24 md:py-36">
          <p className="eyebrow text-white/80">{site.tagline}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Your Trusted Real Estate Consultant in Dubai
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            Delivering tailored real estate solutions in Dubai for over {site.yearsInBusiness} years, with a strong track
            record of client satisfaction, investment success and luxury property expertise.
          </p>
          <div className="mt-10 max-w-5xl">
            <SearchBar types={types} communities={communities} />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/images/site/about.jpg" alt="Dubai skyline" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">Step into the property of prosperity</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">One of Dubai&apos;s most trusted real estate agencies</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Leading Properties has one of the largest inventories of apartments in Dubai. We prioritise client
              satisfaction and provide services tailored to each client&apos;s interests — whether you are looking for a
              home, a quick investment opportunity or commercial space.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { Icon: Building2, label: "Residential & commercial" },
                { Icon: Handshake, label: "Rent, sale & off-plan" },
                { Icon: Award, label: `${site.yearsInBusiness}+ years in Dubai` },
              ].map(({ Icon, label }) => (
                <div key={label} className="rounded-lg border border-zinc-200 p-4">
                  <Icon className="h-6 w-6 text-brand" aria-hidden />
                  <p className="mt-2 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
            <Link href="/about" className="btn-dark mt-8">
              More about us <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section bg-zinc-50">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Featured"
              title="Featured Properties"
              text="Exclusive listings for your next home or investment in prime Dubai locations."
            />
            <Link href="/properties" className="btn-outline">
              View all properties <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Off-plan"
              title="New Arrival Projects"
              text="The latest developments for luxury living and smart investment in Dubai."
            />
            <Link href="/projects" className="btn-outline">
              All projects <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-lg bg-ink">
                <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover opacity-80 transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs uppercase tracking-wider text-white/70">{p.developer}</p>
                  <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white/90 group-hover:text-white">
                    View project <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-zinc-50">
        <div className="container">
          <SectionHeading align="center" eyebrow="Our people" title="Meet Our Sales Team" text="Experienced agents with local expertise to help you buy, sell or rent." />
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {team.slice(0, 12).map((m) => (
              <div key={m.name} className="text-center">
                <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-white ring-1 ring-zinc-200">
                  <Image src={m.image} alt={m.name} fill sizes="112px" className="object-cover" />
                </div>
                <p className="mt-3 text-sm font-bold">{m.name}</p>
                <p className="text-xs text-ink-muted">{m.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/about#team" className="btn-outline">
              Meet the full team
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow={`${site.reviews.source} reviews`}
            title="What Our Clients Say"
            text={`Rated ${site.reviews.rating.toLowerCase()} based on ${site.reviews.count} reviews on ${site.reviews.source}.`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {site.reviews.items.map((r) => (
              <figure key={r.author} className="rounded-lg border border-zinc-200 p-6">
                <div className="flex gap-0.5 text-amber-400" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">“{r.text}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold">{r.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="border-y border-zinc-200 py-12">
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Our partners</p>
          <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-4 lg:grid-cols-8">
            {site.developers.map((d) => (
              <div key={d.name} className="relative h-12">
                <Image src={d.logo} alt={d.name} fill sizes="150px" className="object-contain grayscale transition hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ink text-white">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold">Buying, selling or investing in Dubai?</h2>
            <p className="mt-2 text-zinc-300">Talk to an advisor today — we handle it all with precision and care.</p>
          </div>
          <Link href="/contact" className="btn-primary">
            Ask a question <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
