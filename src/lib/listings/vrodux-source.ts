import type { Listing, ListingsSource } from "./types";

/**
 * Listings from the Vrodux Real Estate website API:
 *   GET {VRODUX_API_URL}/api/real-estate/website/properties     (header X-Api-Key)
 *
 * The API key is generated in Vrodux ERP under Real Estate → Website. It identifies the
 * workspace, so only that workspace's published properties are returned. It is read on the
 * server only (no NEXT_PUBLIC_ prefix) and must never reach the browser.
 *
 * Photo URLs come back signed and expiring; they are used as returned.
 *
 * The API is building-centric (a property with units); this site is listing-centric.
 * Every unit with an asking rent or sale price becomes one listing. A unit offered for
 * both rent and sale becomes two listings, because a renter and a buyer search differently.
 *
 * Check the mapping notes below (area unit, residential/commercial) against production data.
 */

// Mirrors PublicPropertyDto / PublicUnitDto in Softaxis.RealEstate.Application.
interface ApiUnit {
  id: string;
  unitNumber: string;
  unitType: string;
  area: number;
  floor: number;
  rentPerYear: number;
  salePrice: number;
  furnishing: string | null;
  view: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number;
}

interface ApiProperty {
  id: string;
  reference: string;
  name: string;
  propertyType: string;
  address: string;
  city: string;
  emirate: string;
  developer: string | null;
  description: string | null;
  /** Signed relative paths, cover first. */
  imageUrls: string[];
  units: ApiUnit[];
}

interface Paged<T> {
  items: T[];
  totalCount?: number;
}

const COMMERCIAL_TYPES = ["office", "retail", "shop", "warehouse", "commercial", "showroom"];

function config() {
  const baseUrl = process.env.VRODUX_API_URL?.replace(/\/$/, "");
  const apiKey = process.env.VRODUX_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("Listings need VRODUX_API_URL and VRODUX_API_KEY (see .env.example).");
  }
  return {
    baseUrl,
    apiKey,
    revalidate: Number(process.env.VRODUX_REVALIDATE_SECONDS ?? 300),
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toListings(p: ApiProperty, baseUrl: string): Listing[] {
  const images = p.imageUrls.map((path) => `${baseUrl}${path}`);

  return p.units.flatMap((u) => {
    const offers: Array<{ purpose: "rent" | "sale"; price: number }> = [];
    if (u.rentPerYear > 0) offers.push({ purpose: "rent", price: u.rentPerYear });
    if (u.salePrice > 0) offers.push({ purpose: "sale", price: u.salePrice });

    const isCommercial = COMMERCIAL_TYPES.some((t) =>
      `${u.unitType} ${p.propertyType}`.toLowerCase().includes(t),
    );

    return offers.map<Listing>((o) => ({
      id: `${u.id}-${o.purpose}`,
      // Unit id suffix keeps the slug unique and stable even if the building is renamed.
      slug: `${slugify(`${p.name} ${u.unitNumber} ${o.purpose}`)}-${u.id.slice(0, 8)}`,
      reference: p.reference ? `${p.reference}-${u.unitNumber}` : u.unitNumber,
      // A single-unit property is usually already named as a listing ("… Studio for Rent");
      // only multi-unit buildings need the unit spelled out.
      title:
        p.units.length === 1
          ? p.name
          : `${p.name} – ${u.unitType} ${u.unitNumber} for ${o.purpose === "rent" ? "Rent" : "Sale"}`,
      purpose: o.purpose,
      category: isCommercial ? "commercial" : "residential",
      propertyType: u.unitType,
      price: o.price,
      currency: "AED",
      bedrooms: u.bedrooms,
      bathrooms: u.bathrooms,
      // TODO: confirm the unit of PropertyUnit.Area in the ERP (sq.ft vs sqm).
      area: u.area > 0 ? u.area : null,
      furnishing: u.furnishing,
      building: p.name,
      community: p.city || p.emirate,
      city: p.emirate || p.city,
      description: p.description ?? "",
      features: [u.view, u.parking > 0 ? `${u.parking} parking` : null].filter(
        (x): x is string => Boolean(x),
      ),
      images,
      featured: false,
    }));
  });
}

async function fetchAll(): Promise<Listing[]> {
  const { baseUrl, apiKey, revalidate } = config();
  const all: ApiProperty[] = [];
  for (let page = 1; page <= 20; page++) {
    // pageSize is capped at 60 by the API.
    const res = await fetch(`${baseUrl}/api/real-estate/website/properties?page=${page}&pageSize=60`, {
      headers: { "X-Api-Key": apiKey },
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Vrodux listings request failed: HTTP ${res.status}`);
    const body = (await res.json()) as Paged<ApiProperty> | ApiProperty[];
    const items = Array.isArray(body) ? body : body.items;
    all.push(...items);
    if (Array.isArray(body) || items.length < 60) break;
  }
  return all.flatMap((p) => toListings(p, baseUrl));
}

export const vroduxSource: ListingsSource = {
  getAll: fetchAll,
  async getBySlug(slug) {
    return (await fetchAll()).find((l) => l.slug === slug) ?? null;
  },
};
