import data from "@/data/properties.json";
import type { Listing, ListingsSource } from "./types";

const listings = data as Listing[];

export const jsonSource: ListingsSource = {
  async getAll() {
    return listings;
  },
  async getBySlug(slug) {
    return listings.find((l) => l.slug === slug) ?? null;
  },
};
