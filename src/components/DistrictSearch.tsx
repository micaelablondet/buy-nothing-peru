import { useEffect, useMemo, useState } from "react";
import { districts } from "@/data/catalog";

interface DistrictSearchProps {
  value: string;
  onChange: (district: string) => void;
  suggestedDistrict?: string | null;
}

export function DistrictSearch({
  value,
  onChange,
  suggestedDistrict,
}: DistrictSearchProps) {
  const [query, setQuery] = useState(value || suggestedDistrict || "");

  useEffect(() => {
    if (value) {
      setQuery(value);
      return;
    }
    if (suggestedDistrict) {
      setQuery(suggestedDistrict);
    }
  }, [value, suggestedDistrict]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return [...districts];
    }
    return districts.filter((d) => d.toLowerCase().includes(q));
  }, [query]);

  const pick = (district: string) => {
    setQuery(district);
    onChange(district);
  };

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-sm font-medium text-emerald-50">Busca tu distrito</span>
        <input
          type="search"
          className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-3 text-base text-ink outline-none placeholder:text-ink-muted ring-brand focus:ring-2"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            const exact = districts.find(
              (d) => d.toLowerCase() === e.target.value.trim().toLowerCase(),
            );
            if (exact) {
              onChange(exact);
            }
          }}
          placeholder="Ej. Barranco, Miraflores…"
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>

      {suggestedDistrict && !value ? (
        <button
          type="button"
          onClick={() => pick(suggestedDistrict)}
          className="w-full rounded-xl bg-white px-4 py-3 text-left text-sm ring-1 ring-brand"
        >
          <span className="font-semibold text-brand">Usar {suggestedDistrict}</span>
          <span className="mt-0.5 block text-xs text-ink-muted">
            Detectado con tu ubicación
          </span>
        </button>
      ) : null}

      <ul
        className="max-h-52 space-y-2 overflow-y-auto"
        role="listbox"
        aria-label="Distritos"
      >
        {matches.length === 0 ? (
          <li className="rounded-xl bg-white px-4 py-3 text-sm text-ink-muted ring-1 ring-border">
            No encontramos ese distrito. Prueba otro nombre.
          </li>
        ) : (
          matches.map((d) => {
            const selected = value === d;
            return (
              <li key={d}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => pick(d)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium text-ink ring-1 ${
                    selected ? "bg-brand-soft ring-brand" : "bg-white ring-border"
                  }`}
                >
                  {d}
                  {selected ? <span aria-hidden>✓</span> : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
