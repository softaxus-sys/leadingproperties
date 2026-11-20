"use client";

import { useId, useState } from "react";
import { payment } from "@/data/greenwood";

const aed = (n: number) => `AED ${new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(n)}`;

/** Illustrative only: splits a price the visitor picks using the expected plan. Not an offer or quote. */
export function PaymentCalculator() {
  const id = useId();
  const [price, setPrice] = useState(payment.exampleAed);
  const part = (pct: number) => (price * pct) / 100;

  return (
    <div className="text-gw-night">
      <label htmlFor={id} className="block text-base font-semibold">
        Pick a price to see the split
      </label>
      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
        <output htmlFor={id} className="font-serif text-5xl font-medium md:text-6xl">{aed(price)}</output>
        <span className="text-sm text-gw-night/70">Illustration only, not an offer</span>
      </div>
      <input
        id={id}
        type="range"
        min={1_500_000}
        max={6_000_000}
        step={100_000}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="mt-5 w-full accent-gw-forest"
      />
      <dl className="mt-8 grid gap-px overflow-hidden rounded-sm bg-gw-night/15 sm:grid-cols-3">
        <div className="bg-white p-5">
          <dt className="text-sm text-gw-night/70">Booking, {payment.booking}% (expected)</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold">{aed(part(payment.booking))}</dd>
        </div>
        <div className="bg-white p-5">
          <dt className="text-sm text-gw-night/70">During construction, {payment.duringConstruction}%</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold">{aed(part(payment.duringConstruction))}</dd>
        </div>
        <div className="bg-gw-forest p-5 text-white">
          <dt className="text-sm text-white/75">On handover, {payment.onHandover}%</dt>
          <dd className="mt-1 font-serif text-3xl font-semibold">{aed(part(payment.onHandover))}</dd>
        </div>
      </dl>
    </div>
  );
}
