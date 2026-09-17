import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { site, team } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Leading Properties is an award-winning Dubai real estate company specialising in luxury and commercial property.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-ink py-14 text-white">
        <div className="container">
          <p className="eyebrow">{site.tagline}</p>
          <h1 className="mt-2 text-4xl font-extrabold">About Us</h1>
        </div>
      </section>

      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Who we are" title="Where your vision meets results" />
            <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Welcome to Leading Properties, a multi-award-winning real estate company setting benchmarks across the
                UAE. We specialise in luxury and commercial properties, guided by our motto: “{site.tagline}.”
              </p>
              <p>
                We blend innovation, expertise and client-first service to simplify your property journey — from
                finding your dream home to securing smart investments.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src="/images/site/about.jpg" alt="Dubai" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section bg-zinc-50">
        <div className="container grid items-center gap-10 md:grid-cols-[280px_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg">
            <Image src={site.ceo.image} alt={site.ceo.name} fill sizes="280px" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow">CEO&apos;s message</p>
            <Quote className="mt-4 h-8 w-8 text-brand" aria-hidden />
            <blockquote className="mt-3 text-xl leading-relaxed">{site.ceo.message}</blockquote>
            <p className="mt-6 font-bold">{site.ceo.name}</p>
            <p className="text-sm text-ink-muted">
              {site.ceo.title}, {site.name}
            </p>
          </div>
        </div>
      </section>

      <section id="team" className="section scroll-mt-20">
        <div className="container">
          <SectionHeading align="center" eyebrow="Our people" title="Our Team" text="Experienced agents with local expertise." />
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <div className="relative mx-auto aspect-square w-32 overflow-hidden rounded-full bg-zinc-50 ring-1 ring-zinc-200">
                  <Image src={m.image} alt={m.name} fill sizes="128px" className="object-cover" />
                </div>
                <p className="mt-3 font-bold">{m.name}</p>
                <p className="text-sm text-ink-muted">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
