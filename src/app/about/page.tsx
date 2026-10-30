import type { Metadata } from "next";
import Image from "next/image";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamGrid } from "@/components/TeamGrid";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Leading Properties is an award-winning Dubai real estate company specialising in luxury and commercial property.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">About Us</h1>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-soft">
              <p>
                Welcome to Leading Properties, a multi-award-winning real estate company setting benchmarks across the
                UAE. With over a decade of trusted service, we specialize in luxury and commercial properties, guided by
                our slogan, “{site.tagline}.” We blend innovation, deep market knowledge, and client-first service to simplify your
                property journey. From finding your dream home to securing smart investments, Leading Properties is
                where your vision meets results.
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
            <Image src={site.ceo.image} alt={site.ceo.name} fill sizes="280px" className="object-cover object-top" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold">CEO’s Message</h2>
            <Quote className="mt-4 h-8 w-8 text-brand" aria-hidden />
            <blockquote className="mt-3 space-y-4 text-lg leading-relaxed">
              {site.ceo.message.split(/\n{2,}/).map((para) => (
                <p key={para}>{para}</p>
              ))}
            </blockquote>
            <p className="mt-6 font-bold">{site.ceo.name}</p>
            <p className="text-sm text-ink-muted">
              {site.ceo.title}, {site.name}
            </p>
          </div>
        </div>
      </section>

      <section id="team" className="section scroll-mt-20">
        <div className="container">
          <SectionHeading align="center" title="Our Teams" />
          <div className="mt-12">
            <TeamGrid />
          </div>
        </div>
      </section>
    </>
  );
}
