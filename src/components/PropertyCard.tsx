import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Building2, MapPin, Ruler } from "lucide-react";
import type { Listing } from "@/lib/listings";
import { formatArea, formatBeds, formatPrice } from "@/lib/format";

export function PropertyCard({ listing: l }: { listing: Listing }) {
  const cover = l.images[0];
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:shadow-xl">
      <Link href={`/properties/${l.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-zinc-100">
        {cover ? (
          <Image
            src={cover}
            alt={l.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">
            <Building2 className="h-10 w-10" aria-hidden />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase text-white">
          For {l.purpose}
        </span>
        <span className="absolute right-3 top-3 rounded bg-white/90 px-2.5 py-1 text-xs font-semibold capitalize">
          {l.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-lg font-bold text-brand">{formatPrice(l)}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-bold">
          <Link href={`/properties/${l.slug}`} className="hover:text-brand">
            {l.title}
          </Link>
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
          {l.community}, {l.city}
        </p>

        <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-100 pt-4 text-sm text-ink-soft">
          <span className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4" aria-hidden />
            {l.propertyType}
          </span>
          {formatBeds(l.bedrooms) && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="h-4 w-4" aria-hidden />
              {formatBeds(l.bedrooms)}
            </span>
          )}
          {l.bathrooms !== null && (
            <span className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" aria-hidden />
              {l.bathrooms}
            </span>
          )}
          {formatArea(l.area) && (
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4" aria-hidden />
              {formatArea(l.area)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
