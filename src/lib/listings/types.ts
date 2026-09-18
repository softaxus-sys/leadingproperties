/**
 * The listing shape every page renders.
 *
 * Deliberately independent of where listings come from — currently the Vrodux Real Estate
 * website API (vrodux-source.ts). Each source
 * maps its own data into this type, so pages and components never change when the
 * source does.
 */
export type ListingPurpose = "rent" | "sale";
export type ListingCategory = "residential" | "commercial";

export interface Listing {
  id: string;
  /** URL segment. Never reuse a slug for a different unit — old links would point at it. */
  slug: string;
  reference: string | null;
  title: string;
  purpose: ListingPurpose;
  category: ListingCategory;
  propertyType: string;
  /** Rentals: annual figure. null = price on request. */
  price: number | null;
  currency: string;
  /** 0 = studio, null = not applicable (offices, plots). */
  bedrooms: number | null;
  bathrooms: number | null;
  /** Square feet. */
  area: number | null;
  furnishing: string | null;
  building: string | null;
  community: string;
  city: string;
  description: string;
  features: string[];
  /** First image is the cover. Local paths or absolute URLs. */
  images: string[];
  featured: boolean;
}

export type ListingSort = "newest" | "price-asc" | "price-desc";

export interface ListingFilters {
  q?: string;
  purpose?: ListingPurpose;
  category?: ListingCategory;
  type?: string;
  community?: string;
  beds?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: ListingSort;
}

/** Anything that can supply listings. Add a new source by implementing this. */
export interface ListingsSource {
  getAll(): Promise<Listing[]>;
  getBySlug(slug: string): Promise<Listing | null>;
}
