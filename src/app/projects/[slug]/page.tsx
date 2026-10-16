import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, ChevronLeft, Clock, MapPin } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Gallery } from "@/components/Gallery";
import { getProject, getProjects, site } from "@/lib/content";
import { whatsappLink } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: `${p.name} by ${p.developer}`, description: p.summary } : {};
}

export default async function ProjectPage({ params }: { params: Params }) {
  const p = getProject((await params).slug);
  if (!p) notFound();

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={p.images[0]} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
        <div className="container py-20 md:py-28">
          <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white">
            <ChevronLeft className="h-4 w-4" aria-hidden /> All projects
          </Link>
          <p className="eyebrow mt-6">{p.developer}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold md:text-5xl">{p.headline}</h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-200">{p.summary}</p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand" aria-hidden /> {p.location}
            </span>
            {p.unitTypes && <span>{p.unitTypes}</span>}
          </div>
          <a
            href={whatsappLink(site.contact.whatsapp, `Hello, I'd like details on ${p.name} (brochure, availability and payment plan).`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            Request brochure & viewing
          </a>
        </div>
      </section>

      <div className="container grid gap-10 py-12 lg:grid-cols-[1fr_380px]">
        <div>
          {p.description.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold">About the project</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink-soft">
                {p.description.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </section>
          )}

          {p.highlights.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold">Highlights</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <div key={h.title} className="rounded-lg border border-zinc-200 p-5">
                    <CheckCircle2 className="h-5 w-5 text-brand" aria-hidden />
                    <h3 className="mt-2 font-bold">{h.title}</h3>
                    <p className="mt-1 text-sm text-ink-soft">{h.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={p.description.length || p.highlights.length ? "mt-12" : ""}>
            <h2 className="text-2xl font-bold">Gallery</h2>
            <div className="mt-6">
              <Gallery images={p.images} alt={p.name} />
            </div>
          </section>

          {p.distances.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold">Location</h2>
              <ul className="mt-6 divide-y divide-zinc-200 rounded-lg border border-zinc-200">
                {p.distances.map((d) => (
                  <li key={d.place} className="flex items-center justify-between px-5 py-3">
                    <span>{d.place}</span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Clock className="h-4 w-4 text-brand" aria-hidden /> {d.time}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-zinc-200 p-5">
            <h2 className="text-lg font-bold">Register your interest</h2>
            <p className="mt-1 mb-4 text-sm text-ink-muted">Get the brochure, floor plans and payment plan.</p>
            <EnquiryForm subject={`${p.name} by ${p.developer}`} />
          </div>
        </aside>
      </div>
    </>
  );
}
