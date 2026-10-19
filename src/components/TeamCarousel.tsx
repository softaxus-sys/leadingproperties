"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { team } from "@/lib/content";

/** Designations shown under "Meet our Sales Team"; support staff appear only on the About page. */
const SALES_ROLES = ["Sales Manager", "Senior Property Consultant", "Property Consultant"];

const AUTOPLAY_MS = 4500;

/** Above this many pages the dots become unusable and a progress bar is shown instead. */
const MAX_DOTS = 8;

/**
 * Team slider.
 *
 * Built on native scroll-snap rather than a carousel library: touch swipe, trackpad and keyboard
 * scrolling all come for free and keep working if JavaScript fails, so the photos are never
 * trapped behind a broken script. The arrows and dots page by the visible width, so they stay
 * correct at every breakpoint without hardcoding how many cards fit.
 */
export function TeamCarousel({ salesOnly = false }: { salesOnly?: boolean }) {
  const members = salesOnly ? team.filter((m) => SALES_ROLES.includes(m.role)) : team;

  const trackRef = useRef<HTMLUListElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  // Page count and current page are derived from the element itself, so they survive resizing,
  // font loading and a mid-scroll breakpoint change.
  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    setPages(Math.max(1, Math.round(el.scrollWidth / width)));
    setPage(Math.round(el.scrollLeft / width));
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const total = Math.max(1, Math.round(el.scrollWidth / width));
    // Wraps at both ends, so the arrows never dead-end on a one-page screen.
    const target = ((index % total) + total) % total;
    el.scrollTo({ left: target * width, behavior: "smooth" });
  }, []);

  // Autoplay, paused on hover, on keyboard focus, and while the tab is hidden. Skipped entirely
  // for visitors who ask for reduced motion.
  useEffect(() => {
    if (paused || pages < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") goTo(page + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, page, pages, goTo]);

  if (members.length === 0) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="Our team"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        onScroll={measure}
        tabIndex={0}
        aria-label={`${members.length} team members`}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand [&::-webkit-scrollbar]:hidden"
      >
        {members.map((m) => (
          <li
            key={m.name}
            className="group w-[calc(50%-0.625rem)] shrink-0 snap-start overflow-hidden rounded-lg border border-zinc-200 bg-white transition hover:shadow-lg sm:w-[calc(33.333%-0.834rem)] md:w-[calc(25%-0.9375rem)] lg:w-[calc(20%-1rem)] xl:w-[calc(16.666%-1.042rem)]"
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

      {pages > 1 && (
        <>
          <Arrow side="left" onClick={() => goTo(page - 1)} />
          <Arrow side="right" onClick={() => goTo(page + 1)} />

          {/*
            Dots only while they stay countable. On a phone two cards fit at a time, so a dot per
            page is a row of eighteen specks nobody can aim at — a progress bar reads better and
            still says where you are.
          */}
          {pages <= MAX_DOTS ? (
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1} of ${pages}`}
                  aria-current={i === page}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-7 bg-brand" : "w-2 bg-zinc-300 hover:bg-zinc-400"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="mx-auto mt-6 h-1 w-40 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-brand transition-[width,margin] duration-300"
                style={{ width: `${100 / pages}%`, marginInlineStart: `${(page * 100) / pages}%` }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous team members" : "Next team members"}
      className={`absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/95 text-ink shadow-md transition hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:flex ${
        side === "left" ? "-left-4 lg:-left-6" : "-right-4 lg:-right-6"
      }`}
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}
