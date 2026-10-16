"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const arrow = "absolute top-1/2 -translate-y-1/2 bg-black/60 p-2 text-white transition hover:bg-black/80";

/** Main photo with prev/next arrows and a clickable thumbnail strip, as on the live home page. */
export function IntroSlider({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + images.length) % images.length);

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100">
        <Image src={images[i]} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        <button type="button" onClick={() => go(-1)} className={`${arrow} left-0`} aria-label="Previous photo">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => go(1)} className={`${arrow} right-0`} aria-label="Next photo">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-4 gap-2.5">
        {images.map((src, n) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(n)}
            aria-label={`Show photo ${n + 1}`}
            aria-current={n === i}
            className={`relative aspect-[3/2] overflow-hidden transition ${n === i ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
          >
            <Image src={src} alt="" fill sizes="160px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
