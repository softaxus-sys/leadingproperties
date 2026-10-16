"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const step = useCallback(
    (d: number) => setActive((i) => (i + d + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, step]);

  if (images.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative block aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-100"
        aria-label="Open photo viewer"
      >
        <Image src={images[active]} alt={alt} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                i === active ? "border-brand" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button type="button" className="absolute right-4 top-4 p-2 text-white" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 p-3 text-white"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                className="absolute right-2 p-3 text-white"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image src={images[active]} alt={alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
