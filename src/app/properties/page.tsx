import type { Metadata } from "next";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import {
  filterListings,
  filterOptions,
  getListings,
  type ListingFilters,
  type ListingSort,
} from "@/lib/listings";

export const metadata: Metadata = {
  title: "Properties for Rent & Sale in Dubai",
  description: "Browse residential and commercial properties for rent and sale in Dubai with Leading Properties.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(v: string | string[] | undefined) {
  const s = Array.isArray(v) ? v[0] : v;
  return s?.trim() ? s.trim() : undefined;
}

function num(v: string | string[] | undefined) {
  const n = Number(one(v));
  return Number.isFinite(n) && one(v) !== undefined ? n : undefined;
}

function parse(sp: Awaited<SearchParams>): ListingFilters {
  const purpose = one(sp.purpose);
  const category = one(sp.category);
  const sort = one(sp.sort);
  return {
    q: one(sp.q),
    purpose: purpose === "rent" || purpose === "sale" ? purpose : undefined,
    category: category === "residential" || category === "commercial" ? category : undefined,
    type: one(sp.type),
    community: one(sp.community),
    beds: num(sp.beds),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    sort: (["newest", "price-asc", "price-desc"] as ListingSort[]).includes(sort as ListingSort)
      ? (sort as ListingSort)
      : undefined,
  };
}

function heading(f: ListingFilters) {
  const cat = f.category ? `${f.category[0].toUpperCase()}${f.category.slice(1)} ` : "";
  if (f.purpose === "rent") return `${cat}Properties for Rent`;
  if (f.purpose === "sale") return `${cat}Properties for Sale`;
  return cat ? `${cat}Properties` : "All Properties";
}

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const f = parse(await searchParams);
  const all = await getListings();
  const results = filterListings(all, f);
  const { types, communities } = filterOptions(all);

  return (
    <>
      <section className="bg-ink py-14 text-white">
        <div className="container">
          <p className="eyebrow">Listings</p>
          <h1 className="mt-2 text-4xl font-extrabold">{heading(f)}</h1>
          <p className="mt-2 text-zinc-300">
            {results.length} {results.length === 1 ? "property" : "properties"} found
          </p>
        </div>
      </section>

      <section className="container grid gap-8 py-10 lg:grid-cols-[280px_1fr]">
        {/* Filters are a GET form: no JavaScript needed, and results are a shareable URL. */}
        <aside>
          <form action="/properties" method="get" className="space-y-4 rounded-lg border border-zinc-200 p-5 lg:sticky lg:top-24">
            <p className="flex items-center gap-2 font-bold">
              <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filter
            </p>
            <Field label="Keyword" id="f-q">
              <input id="f-q" name="q" defaultValue={f.q} placeholder="Building, area, ref…" className="field" />
            </Field>
            <Field label="Purpose" id="f-purpose">
              <select id="f-purpose" name="purpose" defaultValue={f.purpose ?? ""} className="field">
                <option value="">Rent or buy</option>
                <option value="rent">Rent</option>
                <option value="sale">Buy</option>
              </select>
            </Field>
            <Field label="Category" id="f-category">
              <select id="f-category" name="category" defaultValue={f.category ?? ""} className="field">
                <option value="">Any</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </Field>
            <Field label="Property type" id="f-type">
              <select id="f-type" name="type" defaultValue={f.type ?? ""} className="field">
                <option value="">Any</option>
                {types.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Location" id="f-community">
              <select id="f-community" name="community" defaultValue={f.community ?? ""} className="field">
                <option value="">All locations</option>
                {communities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Min. bedrooms" id="f-beds">
              <select id="f-beds" name="beds" defaultValue={f.beds?.toString() ?? ""} className="field">
                <option value="">Any</option>
                <option value="0">Studio+</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}+
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Min AED" id="f-min">
                <input id="f-min" name="minPrice" type="number" min={0} step={1000} defaultValue={f.minPrice} className="field" />
              </Field>
              <Field label="Max AED" id="f-max">
                <input id="f-max" name="maxPrice" type="number" min={0} step={1000} defaultValue={f.maxPrice} className="field" />
              </Field>
            </div>
            <Field label="Sort" id="f-sort">
              <select id="f-sort" name="sort" defaultValue={f.sort ?? ""} className="field">
                <option value="">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </Field>
            <button type="submit" className="btn-primary w-full">
              Apply filters
            </button>
            <Link href="/properties" className="block text-center text-sm text-ink-muted hover:text-brand">
              Clear all
            </Link>
          </form>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
              <h2 className="text-xl font-bold">No properties match these filters</h2>
              <p className="mt-2 text-ink-muted">Try widening your search, or tell us what you need and we&apos;ll find it.</p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/properties" className="btn-outline">Clear filters</Link>
                <Link href="/contact" className="btn-primary">Contact an advisor</Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}
