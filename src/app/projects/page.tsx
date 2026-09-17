import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getProjects, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "New Projects in Dubai",
  description: "Explore the latest off-plan developments in Dubai from Binghatti, Damac, Meraas, Sobha, Reportage and more.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <>
      <section className="bg-ink py-14 text-white">
        <div className="container">
          <p className="eyebrow">New projects</p>
          <h1 className="mt-2 text-4xl font-extrabold">Latest Projects</h1>
          <p className="mt-2 max-w-2xl text-zinc-300">
            Discover homes redefining luxury living — unique developments offering elegance, sophistication and strong
            investment potential.
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="group overflow-hidden rounded-lg border border-zinc-200 transition hover:shadow-xl">
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
              <Image src={p.images[0]} alt={p.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-brand">{p.developer}</p>
              <h2 className="mt-1 text-xl font-bold">{p.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                <MapPin className="h-4 w-4" aria-hidden /> {p.location}
              </p>
              <p className="mt-3 line-clamp-3 text-sm text-ink-soft">{p.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
                View project <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </section>

      <section className="border-t border-zinc-200 py-12">
        <div className="container">
          <h2 className="text-center text-xl font-bold">Our Partners</h2>
          <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-4 lg:grid-cols-8">
            {site.developers.map((d) => (
              <div key={d.name} className="relative h-12">
                <Image src={d.logo} alt={d.name} fill sizes="150px" className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
