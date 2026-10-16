import Image from "next/image";
import { team } from "@/lib/content";

/** Designations shown under "Meet our Sales Team"; support staff appear only on the About page. */
const SALES_ROLES = ["Sales Manager", "Senior Property Consultant", "Property Consultant"];

/**
 * Whole team in one continuous grid, ordered by designation (team.json lists the most senior first),
 * so small groups never leave empty space. Only a part-filled last row is centered.
 * Portrait cards keep the whole photo (head to crossed arms) instead of cropping into a circle.
 */
export function TeamGrid({ salesOnly = false }: { salesOnly?: boolean }) {
  const members = salesOnly ? team.filter((m) => SALES_ROLES.includes(m.role)) : team;
  return (
    <ul className="flex flex-wrap justify-center gap-5">
      {members.map((m) => (
        <li
          key={m.name}
          className="group w-[calc(50%-0.625rem)] overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:shadow-lg sm:w-[calc(33.333%-0.834rem)] md:w-[calc(25%-0.9375rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.042rem)]"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
            <Image
              src={m.image}
              alt={m.name}
              fill
              sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover object-top transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="border-t-2 border-brand px-3 py-3 text-center">
            <p className="text-sm font-bold">{m.name}</p>
            <p className="mt-0.5 text-xs font-medium text-brand">{m.role}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
