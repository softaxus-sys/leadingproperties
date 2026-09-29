"use client";

import Link from "next/link";
import { RotateCw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container py-24 text-center">
      <p className="eyebrow">Temporarily unavailable</p>
      <h1 className="mt-2 text-4xl font-extrabold uppercase">We couldn&apos;t load this page</h1>
      <p className="mx-auto mt-4 max-w-xl text-ink-muted">
        Our listings service is not responding right now. Please try again in a moment, or contact us and we&apos;ll
        send you the details directly.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          <RotateCw className="h-4 w-4" aria-hidden /> Try again
        </button>
        <Link href="/contact" className="btn-outline">
          Contact us
        </Link>
      </div>
    </section>
  );
}
