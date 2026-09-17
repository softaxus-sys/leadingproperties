import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center py-28 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-ink-muted">The page or property you&apos;re looking for may have been let, sold or moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/properties" className="btn-primary">Browse properties</Link>
        <Link href="/" className="btn-outline">Home</Link>
      </div>
    </div>
  );
}
