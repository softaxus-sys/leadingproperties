import type { MetadataRoute } from "next";
import { getProjects, siteUrl } from "@/lib/content";
import { getListings } from "@/lib/listings";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/properties", "/projects", "/about", "/contact", "/privacy-policy"].map((p) => ({
    url: `${siteUrl}${p}`,
  }));
  const listings = (await getListings()).map((l) => ({ url: `${siteUrl}/properties/${l.slug}` }));
  const projects = getProjects().map((p) => ({ url: `${siteUrl}/projects/${p.slug}` }));
  return [...pages, ...listings, ...projects];
}
