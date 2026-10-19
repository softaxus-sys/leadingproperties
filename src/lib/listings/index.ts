import { jsonSource } from "./json-source";
import { vroduxSource } from "./vrodux-source";
import type { Listing, ListingFilters, ListingsSource } from "./types";

export type * from "./types";

/** The single switch between local JSON and the Vrodux API. Pages only import from here. */
function source(): ListingsSource {
  return process.env.LISTINGS_SOURCE === "vrodux" ? vroduxSource : jsonSource;
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
    // Substring over area AND city, not equality: the location box is a free-text search, so
    // "marina" finds "Dubai Marina" and "dubai" finds everything in the city. The catch-all
    // choices filter nothing.
    if (f.community && !isAnyLocation(f.community)) {
      const needle = f.community.trim().toLowerCase();
      const haystack = `${l.community} ${l.city}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
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
/**
 * Areas offered in the search, whether or not something is currently listed there — a buyer
 * looking for Palm Jumeirah should be able to say so and be told plainly that nothing is
 * available, rather than conclude the agency does not cover it. Areas that appear in the
 * listings are merged in, so anything added in the ERP shows up without editing this list.
 */
const DUBAI_AREAS = [
  "Al Garhoud",
  "Al Barsha",
  "Al Furjan",
  "Al Quoz",
  "Arabian Ranches",
  "Bluewaters Island",
  "Business Bay",
  "City Walk",
  "Damac Hills",
  "Downtown Dubai",
  "Dubai",
  "Dubai Creek Harbour",
  "Dubai Hills Estate",
  "Dubai Marina",
  "Dubai Silicon Oasis",
  "Dubai South",
  "Dubailand",
  "Emirates Hills",
  "International City",
  "Jumeirah",
  "Jumeirah Bay Island",
  "Jumeirah Beach Residence",
  "Jumeirah Golf Estates",
  "Jumeirah Lake Towers",
  "Jumeirah Village Circle",
  "MBR City",
  "Palm Jumeirah",
  "Sheikh Zayed Road",
  "Sports City",
  "The Greens",
  "The Springs",
];

/**
 * Catch-all choices kept at the ends of the list rather than sorted into it. Selecting one is the
 * same as not filtering at all, which is what a visitor means by "anywhere".
 */
const ANY_LOCATION = "All Cities";
const WHOLE_COUNTRY = "United Arab Emirates";

/** True when the chosen location means "show me everything". */
function isAnyLocation(value: string) {
  const v = value.trim().toLowerCase();
  return v === ANY_LOCATION.toLowerCase() || v === WHOLE_COUNTRY.toLowerCase();
}

export function filterOptions(all: Listing[]) {
  const uniq = (xs: string[]) =>
    [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return {
    types: uniq(all.map((l) => l.propertyType)),
    communities: [
      ANY_LOCATION,
      ...uniq([...DUBAI_AREAS, ...all.map((l) => l.community)]),
      WHOLE_COUNTRY,
    ],
  };
}
