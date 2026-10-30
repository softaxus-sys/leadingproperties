import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { IntroSlider } from "@/components/IntroSlider";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { SearchBar } from "@/components/SearchBar";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamCarousel } from "@/components/TeamCarousel";
import { getProjects, site } from "@/lib/content";
import { filterOptions, getFeaturedListings, getListings } from "@/lib/listings";

export const revalidate = 300;

export default async function HomePage() {
  const [all, featured] = await Promise.all([getListings(), getFeaturedListings(6)]);
  const { types, communities } = filterOptions(all);
  const projects = getProjects().filter((p) => p.featured).slice(0, 4);
  // Same picks as the live site's "Best Properties for Sale" block.
  const best = [
    "the-pad-business-bay-2-bhk-for-rent",
    "citadel-tower-business-bay-office-for-rent",
    "mag-318-business-bay-studio-for-rent",
    "al-manara-tower-business-bay-office-for-rent",
  ]
    .map((slug) => all.find((l) => l.slug === slug))
    .filter((l) => l !== undefined);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-ink">
        <Image src="/images/site/hero.webp" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="container py-24 md:py-36">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-brand">{site.tagline}</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Leading Properties-Your Trusted Real Estate Consultant in Dubai
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            Delivering tailored real estate solutions in Dubai for over {site.yearsInBusiness} years, with a strong track
            record of client satisfaction, investment success, and specialist knowledge of luxury property.
          </p>
          <div className="mt-10 max-w-5xl">
            <SearchBar types={types} communities={communities} />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <IntroSlider
            images={["/images/site/intro-1.jpg", "/images/site/intro-2.jpg", "/images/site/intro-3.webp", "/images/site/intro-4.png"]}
          />
          <div>
            <p className="inline-block border-b border-brand pb-1 text-lg text-brand">Step into the Property of Prosperity</p>
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">With Over 100,000 Active Listings</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Leading Properties Dubai has the largest inventory of apartments in Dubai. Leading properties have grown
              to be one of the most trusted real estate agencies in Dubai. We prioritize client satisfaction and provide
              valuable services tailored to their interests, which proves beneficial for them.
            </p>
            <Link href="/about" className="btn-dark mt-8">
              More About US
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section bg-zinc-50">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              title="Featured Properties"
              text="Discover Premium Featured Properties, Exclusive Listings for Your Dream Home in Prime Locations"
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
              title="NEW ARRIVAL PROJECTS"
              text="Explore Exciting New Arrival Projects – Latest Developments for Luxury Living and Smart Investments in Dubai"
            />
            <Link href="/projects" className="btn-outline">
              View Projects <ArrowRight className="h-4 w-4" aria-hidden />
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

      {/* Best for sale */}
      <section className="section bg-zinc-50">
        <div className="container">
          <SectionHeading
            title="BEST PROPERTIES FOR SALE"
            text="Find the Best Properties for Sale – Premium Homes, Apartments, and Investment Opportunities in Top Locations"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {best.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <SectionHeading align="center" title="Meet our Sales Team" text="Experienced agents with local market knowledge to help sell your property." />
          <div className="mt-12">
            <TeamCarousel salesOnly />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section bg-zinc-50">
        <div className="container">
          <SectionHeading
            align="center"
            eyebrow="our Clients"
            title="client Reviews on Google"
            text={`${site.reviews.rating.toUpperCase()} · Based on ${site.reviews.count} reviews`}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {site.reviews.items.map((r) => (
              <figure key={r.author} className="rounded-lg border border-zinc-200 p-6">
                <div className="flex gap-0.5 text-amber-400" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-ink-soft">{r.text}</blockquote>
                <figcaption className="mt-4 text-sm font-bold">{r.author}</figcaption>
                <p className="text-xs text-ink-muted">Posted on Google</p>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section className="border-y border-zinc-200 py-12">
        <div className="container">
          <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">Our Partners</p>
          <div className="mt-8">
            <PartnerCarousel partners={site.developers} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-ink text-white">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold">Fast And Reliable Service For Your Project Or A Quick Fix, We Do It All!</h2>
            <p className="mt-2 text-zinc-300">
              whether you&apos;re seeking your dream home, a quick investment opportunity, or professional project support, we
              handle it all with precision and care.
            </p>
          </div>
          <Link href="/contact" className="btn-primary">
            ask a question <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
