import type { Metadata } from "next";
import Script from "next/script";
import { Cormorant_Garamond } from "next/font/google";
import { PAGE_PATH, images } from "@/data/greenwood";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const title = "Greenwood by Aldar | Townhouses & Villas in Dubai Silicon Oasis";
const description =
  "Register your interest in an upcoming master-planned Aldar community in Dubai Silicon Oasis: 3 to 5 bedroom townhouses and villas, with an expected 55/45 payment plan. Preliminary information.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: PAGE_PATH },
  openGraph: {
    title,
    description,
    url: PAGE_PATH,
    type: "website",
    locale: "en_AE",
    images: [{ url: images.hero, alt: "Representative image of a landscaped residential community" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [images.hero] },
};

// Tracking IDs come from environment variables; nothing loads unless configured.
const GTM = process.env.NEXT_PUBLIC_GTM_ID;
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
// The Meta Pixel is installed site-wide in the root layout.
const ADS = process.env.NEXT_PUBLIC_GADS_ID;

export default function Layout({ children }: { children: React.ReactNode }) {
  // With GTM, GA4 and Google Ads are managed inside the container; otherwise gtag.js loads them directly.
  const gtagId = !GTM ? GA4 || ADS : undefined;
  return (
    <div className={serif.variable}>
      {GTM && (
        <>
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');`}
          </Script>
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
          </noscript>
        </>
      )}
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());${GA4 ? `gtag('config','${GA4}');` : ""}${ADS ? `gtag('config','${ADS}');` : ""}`}
          </Script>
        </>
      )}
      {children}
    </div>
  );
}
