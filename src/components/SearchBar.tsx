import { Search } from "lucide-react";

/** Plain GET form — works without JavaScript and produces a shareable results URL. */
export function SearchBar({ communities, types }: { communities: string[]; types: string[] }) {
  return (
    <form action="/properties" method="get" className="grid gap-3 rounded-lg bg-white p-4 shadow-xl md:grid-cols-5">
      <label className="sr-only" htmlFor="s-purpose">Looking for</label>
      <select id="s-purpose" name="purpose" className="field" defaultValue="">
        <option value="">Rent or Buy</option>
        <option value="rent">Rent</option>
        <option value="sale">Buy</option>
      </select>
      <label className="sr-only" htmlFor="s-category">Category</label>
      <select id="s-category" name="category" className="field" defaultValue="">
        <option value="">Any category</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>
      <label className="sr-only" htmlFor="s-type">Property type</label>
      <select id="s-type" name="type" className="field" defaultValue="">
        <option value="">Any type</option>
        {types.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <label className="sr-only" htmlFor="s-community">Location</label>
      <select id="s-community" name="community" className="field" defaultValue="">
        <option value="">All locations</option>
        {communities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <button type="submit" className="btn-primary">
        <Search className="h-4 w-4" aria-hidden /> Search
      </button>
    </form>
  );
}
