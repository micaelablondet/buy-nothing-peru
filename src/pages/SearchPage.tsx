import { useState } from "react";
import { Link } from "react-router-dom";
import { SearchResultCard } from "@/components/SearchResultCard";
import { PILOT_DISTRICT } from "@/data/catalog";
import { PROTOTYPE_POST_TYPES } from "@/lib/brand";
import { feedTypeTabLabels } from "@/lib/postLabels";
import { postMatchesQuery } from "@/lib/search";
import type { PostType } from "@/lib/types";
import { usePrototypeStore } from "@/store/prototypeStore";

type TypeFilter = "todos" | PostType;

export function SearchPage() {
  const profile = usePrototypeStore((s) => s.profile);
  const posts = usePrototypeStore((s) => s.posts);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("todos");

  const district = profile?.district ?? PILOT_DISTRICT;
  const results = posts
    .filter(
      (p) =>
        p.status === "active" &&
        PROTOTYPE_POST_TYPES.includes(p.type) &&
        p.district === district &&
        (typeFilter === "todos" || p.type === typeFilter) &&
        postMatchesQuery(p, query),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const filters: { value: TypeFilter; label: string }[] = [
    { value: "todos", label: "Todos" },
    ...PROTOTYPE_POST_TYPES.map((t) => ({
      value: t,
      label: feedTypeTabLabels[t],
    })),
  ];
  const trimmed = query.trim();

  return (
    <div className="space-y-4 px-4 pb-4">
      <h1 className="pt-2 text-3xl font-bold">Busca</h1>

      <label className="flex items-center gap-2 rounded-2xl bg-surface-elevated px-4 py-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-brand">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-muted" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="sr-only">Buscar</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca lo que necesitas"
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted"
          autoFocus
        />
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-ink">
          📍 {district}
        </span>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Tipo">
          {filters.map((f) => {
            const active = typeFilter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand text-white"
                    : "bg-surface-elevated text-ink-muted ring-1 ring-border"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="space-y-3 rounded-2xl bg-white p-6 text-center text-sm text-ink-muted ring-1 ring-border">
          {trimmed ? (
            <>
              <p>
                No encontramos “{trimmed}” en tu barrio.
              </p>
              <Link
                to={`/publicar?tipo=pido&titulo=${encodeURIComponent(trimmed)}`}
                className="inline-block rounded-xl bg-brand px-4 py-2.5 font-semibold text-white"
              >
                Pídelo
              </Link>
            </>
          ) : (
            <p>Aún no hay publicaciones activas en {district}.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {results.map((post) => (
            <SearchResultCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
