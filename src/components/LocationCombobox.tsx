"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MapPin, X } from "lucide-react";

/**
 * Searchable location field.
 *
 * A text input rather than a <select>: with twenty-odd areas, typing "mar" beats scrolling to
 * Dubai Marina. It stays a plain input inside the GET form, so a visitor can also type an area
 * nobody has listed yet and the results page answers honestly instead of refusing the search —
 * matching is on a substring, so "marina" finds "Dubai Marina".
 */
export function LocationCombobox({
  name = "community",
  options,
  defaultValue = "",
  id,
  placeholder = "All locations",
}: {
  name?: string;
  options: string[];
  defaultValue?: string;
  id?: string;
  placeholder?: string;
}) {
  const reactId = useId();
  const inputId = id ?? `loc-${reactId}`;
  const listId = `${inputId}-list`;

  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const query = value.trim().toLowerCase();
  const matches = query
    ? options.filter((o) => o.toLowerCase().includes(query))
    : options;

  // Close when the focus or the pointer goes elsewhere; without this the list hangs over the
  // rest of the form after the visitor has moved on.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (active < 0) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (option: string) => {
    setValue(option);
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(0);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => {
        const next = i + step;
        if (next < 0) return matches.length - 1;
        if (next >= matches.length) return 0;
        return next;
      });
      return;
    }
    if (e.key === "Enter" && open && active >= 0 && matches[active]) {
      // Pick the highlighted area instead of submitting the half-typed text.
      e.preventDefault();
      choose(matches[active]);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={wrapRef} className="relative">
      <MapPin
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        id={inputId}
        name={name}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="field ps-9 pe-8"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear location"
          onClick={() => {
            setValue("");
            setOpen(false);
          }}
          className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-muted hover:text-ink"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}

      {open && (
        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          aria-label="Locations"
          className="absolute z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-sm text-ink-muted">
              No matching area — search anyway to see what&apos;s nearby.
            </li>
          ) : (
            matches.map((option, i) => (
              <li
                key={option}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={option.toLowerCase() === query}
                // pointerdown fires before the input's blur, so the click is never swallowed.
                onPointerDown={(e) => {
                  e.preventDefault();
                  choose(option);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-2 text-sm ${
                  i === active ? "bg-brand text-white" : "hover:bg-zinc-50"
                }`}
              >
                {option}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
