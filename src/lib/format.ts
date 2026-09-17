import type { Listing } from "./listings";

export function formatPrice(l: Pick<Listing, "price" | "currency" | "purpose">) {
  if (l.price === null) return "Price on request";
  const amount = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(l.price);
  return `${l.currency} ${amount}${l.purpose === "rent" ? " / year" : ""}`;
}

export function formatArea(area: number | null) {
  if (area === null) return null;
  return `${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(area)} sq.ft.`;
}

export function formatBeds(bedrooms: number | null) {
  if (bedrooms === null) return null;
  return bedrooms === 0 ? "Studio" : `${bedrooms} Bed${bedrooms === 1 ? "" : "s"}`;
}

export function whatsappLink(number: string, message?: string) {
  const base = `https://wa.me/${number.replace(/\D/g, "")}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
