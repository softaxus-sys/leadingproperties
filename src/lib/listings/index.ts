import { vroduxSource } from "./vrodux-source";
import type { Listing, ListingFilters, ListingsSource } from "./types";

export type * from "./types";

/**
 * Listings come only from Vrodux ERP (Real Estate → Website). Pages only import from here, so
 * another source can be added later by implementing ListingsSource and switching it in.
 */
function source(): ListingsSource {
  return vroduxSource;
}

export const getListings = () => source().getAll();
export const getListing = (slug: string) => source().getBySlug(slug);

export async function getFeaturedListings(limit = 6) {
  const all = await getListings();
  const featured = all.filter((l) => l.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export function filterListings(all: Listing[], f: ListingFilters): Listing[] {
  const q = f.q?.trim().toLowerCase();
  const result = all.filter((l) => {
    if (f.purpose && l.purpose !== f.purpose) return false;
    if (f.category && l.category !== f.category) return false;
    if (f.type && l.propertyType.toLowerCase() !== f.type.toLowerCase()) return false;
    if (f.community && l.community.toLowerCase() !== f.community.toLowerCase()) return false;
    if (f.beds !== undefined && (l.bedrooms ?? -1) < f.beds) return false;
    // Price-on-request listings stay in price-filtered results; hiding them would hide
    // the top of the market from exactly the buyers filtering for it.
    if (l.price !== null) {
      if (f.minPrice !== undefined && l.price < f.minPrice) return false;
      if (f.maxPrice !== undefined && l.price > f.maxPrice) return false;
    }
    if (q) {
      const hay = [l.title, l.building, l.community, l.city, l.propertyType, l.reference]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (f.sort === "price-asc" || f.sort === "price-desc") {
    const dir = f.sort === "price-asc" ? 1 : -1;
    result.sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return (a.price - b.price) * dir;
    });
  }
  return result;
}

/** Distinct values for filter dropdowns, derived from the data so they never drift. */
export function filterOptions(all: Listing[]) {
  const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b));
  return {
    types: uniq(all.map((l) => l.propertyType)),
    communities: uniq(all.map((l) => l.community)),
  };
}
