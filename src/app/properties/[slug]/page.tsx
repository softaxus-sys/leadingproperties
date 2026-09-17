import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Building2, Check, ChevronLeft, Hash, MapPin, Phone, Ruler, Sofa } from "lucide-react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Gallery } from "@/components/Gallery";
import { PropertyCard } from "@/components/PropertyCard";
import { site } from "@/lib/content";
import { formatArea, formatBeds, formatPrice, whatsappLink } from "@/lib/format";
import { getListing, getListings } from "@/lib/listings";

export const revalidate = 300;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getListings()).map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const l = await getListing((await params).slug);
  if (!l) return { title: "Property not found" };
  return {
    title: l.title,
    description: `${formatPrice(l)} · ${l.community}, ${l.city}. ${l.description}`.slice(0, 160),
    openGraph: { images: l.images.slice(0, 1) },
  };
}

export default async function PropertyPage({ params }: { params: Params }) {
  const l = await getListing((await params).slug);
  if (!l) notFound();

  const similar = (await getListings())
    .filter((x) => x.id !== l.id && x.purpose === l.purpose && x.category === l.category)
    .slice(0, 3);

  const facts = [
    { Icon: Building2, label: "Type", value: l.propertyType },
    { Icon: BedDouble, label: "Bedrooms", value: formatBeds(l.bedrooms) },
    { Icon: Bath, label: "Bathrooms", value: l.bathrooms?.toString() ?? null },
    { Icon: Ruler, label: "Size", value: formatArea(l.area) },
    { Icon: Sofa, label: "Furnishing", value: l.furnishing },
    { Icon: Hash, label: "Reference", value: l.reference },
  ].filter((f) => f.value);

  const enquiry = `${l.title}${l.reference ? ` (Ref ${l.reference})` : ""}`;

  return (
    <div className="container py-8">
      <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-brand">
        <ChevronLeft className="h-4 w-4" aria-hidden /> Back to properties
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex gap-2">
            <span className="rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase text-white">For {l.purpose}</span>
            <span className="rounded bg-zinc-100 px-2.5 py-1 text-xs font-semibold capitalize">{l.category}</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold md:text-4xl">{l.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-ink-muted">
            <MapPin className="h-4 w-4" aria-hidden />
            {[l.building, l.community, l.city].filter(Boolean).join(", ")}
          </p>
        </div>
        <p className="text-3xl font-extrabold text-brand">{formatPrice(l)}</p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <Gallery images={l.images} alt={l.title} />

          <dl className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-zinc-200 p-5 sm:grid-cols-3">
            {facts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 text-brand" aria-hidden />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 text-2xl font-bold">Description</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{l.description}</p>

          {l.features.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-bold">Features</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {l.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-ink-soft">
                    <Check className="h-4 w-4 text-brand" aria-hidden /> {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-zinc-200 p-5">
            <h2 className="text-lg font-bold">Interested in this property?</h2>
            <p className="mt-1 text-sm text-ink-muted">Send us your details and an advisor will get back to you.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:${site.contact.phone}`} className="btn-dark">
                <Phone className="h-4 w-4" aria-hidden /> Call
              </a>
              <a
                href={whatsappLink(site.contact.whatsapp, `Hello, I'm interested in ${enquiry}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] text-white hover:bg-[#1eb957]"
              >
                WhatsApp
              </a>
            </div>
            <div className="mt-5 border-t border-zinc-100 pt-5">
              <EnquiryForm subject={enquiry} />
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Similar properties</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <PropertyCard key={s.id} listing={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
