import Image from "next/image";

/**
 * Continuously scrolling logo strip, like the live site's partner carousel (6 visible on desktop).
 * The list is rendered twice so the loop is seamless; the copy is hidden from screen readers.
 */
export function PartnerCarousel({ partners }: { partners: { name: string; logo: string }[] }) {
  return (
    <div className="group overflow-hidden">
      <div className="flex w-max animate-[marquee_35s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0" aria-hidden={copy === 1 || undefined}>
            {partners.map((d) => (
              <li key={d.name} className="relative mx-10 h-20 w-36 shrink-0">
                <Image src={d.logo} alt={copy === 0 ? d.name : ""} fill sizes="144px" className="object-contain" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
