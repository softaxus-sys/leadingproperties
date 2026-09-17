import type { Listing, ListingsSource } from "./types";

/**
 * Listings from the Vrodux Real Estate public API:
 *   GET {VRODUX_API_URL}/api/real-estate/public/{tenantSlug}/properties
 *   GET {VRODUX_API_URL}/api/real-estate/public/{tenantSlug}/properties/{id}/images/{imageId}
 *
 * The API is building-centric (a property with units); this site is listing-centric.
 * Every unit with an asking rent or sale price becomes one listing. A unit offered for
 * both rent and sale becomes two listings, because a renter and a buyer search differently.
 *
 * Not yet exercised against live data — enable with LISTINGS_SOURCE=vrodux and check the
 * mapping notes below against a real response before switching production over.
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
  imageIds: string[];
  primaryImageId: string | null;
  units: ApiUnit[];
}

interface Paged<T> {
  items: T[];
  totalCount?: number;
}

const COMMERCIAL_TYPES = ["office", "retail", "shop", "warehouse", "commercial", "showroom"];

function config() {
  const baseUrl = process.env.VRODUX_API_URL?.replace(/\/$/, "");
  const tenant = process.env.VRODUX_TENANT_SLUG;
  if (!baseUrl || !tenant) {
    throw new Error("LISTINGS_SOURCE=vrodux needs VRODUX_API_URL and VRODUX_TENANT_SLUG.");
  }
  return {
    root: `${baseUrl}/api/real-estate/public/${encodeURIComponent(tenant)}`,
    revalidate: Number(process.env.VRODUX_REVALIDATE_SECONDS ?? 300),
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toListings(p: ApiProperty, root: string): Listing[] {
  const ordered = p.primaryImageId
    ? [p.primaryImageId, ...p.imageIds.filter((i) => i !== p.primaryImageId)]
    : p.imageIds;
  const images = ordered.map((img) => `${root}/properties/${p.id}/images/${img}`);

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
      title: `${p.name} – ${u.unitType} for ${o.purpose === "rent" ? "Rent" : "Sale"}`,
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
  const { root, revalidate } = config();
  const all: ApiProperty[] = [];
  for (let page = 1; page <= 20; page++) {
    const res = await fetch(`${root}/properties?page=${page}&pageSize=100`, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`Vrodux listings request failed: HTTP ${res.status}`);
    const body = (await res.json()) as Paged<ApiProperty> | ApiProperty[];
    const items = Array.isArray(body) ? body : body.items;
    all.push(...items);
    if (Array.isArray(body) || items.length < 100) break;
  }
  return all.flatMap((p) => toListings(p, root));
}

export const vroduxSource: ListingsSource = {
  getAll: fetchAll,
  async getBySlug(slug) {
    return (await fetchAll()).find((l) => l.slug === slug) ?? null;
  },
};
