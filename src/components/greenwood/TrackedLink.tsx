"use client";

import { useEffect } from "react";
import { captureAttribution, track } from "@/lib/greenwood-track";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  /** Where on the page the link sits, for analytics. */
  location: string;
  kind?: "cta" | "whatsapp" | "call";
  /** Preselect this property type in the enquiry form when clicked. */
  propertyType?: string;
};

export function TrackedLink({ location, kind = "cta", propertyType, onClick, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        track(kind === "whatsapp" ? "whatsapp_click" : kind === "call" ? "call_click" : "cta_click", {
          location,
          label: typeof children === "string" ? children : undefined,
          property_type: propertyType,
        });
        if (propertyType) window.dispatchEvent(new CustomEvent("gw:prefill", { detail: { type: propertyType } }));
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}

/** Mount once: stores UTM/click IDs for lead attribution. */
export function AttributionCapture() {
  useEffect(() => captureAttribution(), []);
  return null;
}
