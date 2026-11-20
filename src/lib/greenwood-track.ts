/** Client-side tracking helpers for the Greenwood landing page. Browser-only; call from effects/handlers. */

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;
const STORE = "gw_attribution";

export type Attribution = Partial<Record<(typeof KEYS)[number] | "landing_page" | "referrer", string>>;

/** Save UTM / click IDs from the URL. The first landing URL is kept; newer campaign params overwrite older ones. */
export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const k of KEYS) {
      const v = params.get(k);
      if (v) found[k] = v.slice(0, 200);
    }
    const prev: Attribution = JSON.parse(sessionStorage.getItem(STORE) || "{}");
    const next: Attribution = {
      landing_page: prev.landing_page ?? window.location.href,
      referrer: prev.referrer ?? (document.referrer || undefined),
      ...prev,
      ...found,
    };
    sessionStorage.setItem(STORE, JSON.stringify(next));
  } catch {
    /* storage unavailable: attribution simply isn't kept */
  }
}

export function getAttribution(): Attribution {
  try {
    const stored: Attribution = JSON.parse(sessionStorage.getItem(STORE) || "{}");
    return { landing_page: window.location.href, ...stored };
  } catch {
    return { landing_page: window.location.href };
  }
}

const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const ADS = process.env.NEXT_PUBLIC_GADS_ID;
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GADS_LEAD_LABEL;

/**
 * Fire an event to every configured destination:
 *  - dataLayer (GTM picks this up),
 *  - GA4 via gtag when GTM isn't managing tags,
 *  - Meta Pixel,
 *  - Google Ads conversion (leads only).
 */
export function track(event: "cta_click" | "whatsapp_click" | "call_click" | "generate_lead", params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...params });

    if (!GTM && window.gtag) {
      window.gtag("event", event, params);
      if (event === "generate_lead" && ADS && ADS_LEAD_LABEL) {
        window.gtag("event", "conversion", { send_to: `${ADS}/${ADS_LEAD_LABEL}` });
      }
    }

    if (window.fbq) {
      if (event === "generate_lead") window.fbq("track", "Lead", params);
      else if (event === "whatsapp_click" || event === "call_click") window.fbq("track", "Contact", params);
      else window.fbq("trackCustom", "CtaClick", params);
    }
  } catch {
    /* never let analytics break the page */
  }
}
