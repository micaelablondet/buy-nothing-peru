import { useState } from "react";
import { CategoryChips } from "@/components/CategoryChips";
import { PostCard } from "@/components/PostCard";
import { SideMenu } from "@/components/SideMenu";
import { TypeTabs } from "@/components/TypeTabs";
import { PILOT_DISTRICT, postMatchesFeedCategory } from "@/data/catalog";
import { hasListingDataForDistrict } from "@/lib/location";
import { usePrototypeStore } from "@/store/prototypeStore";

export function FeedPage() {
  const profile = usePrototypeStore((s) => s.profile);
  const feedType = usePrototypeStore((s) => s.feedType);
  const feedCategory = usePrototypeStore((s) => s.feedCategory);
  const setFeedType = usePrototypeStore((s) => s.setFeedType);
  const setFeedCategory = usePrototypeStore((s) => s.setFeedCategory);
  const posts = usePrototypeStore((s) => s.posts);
  const [menuOpen, setMenuOpen] = useState(false);

  const district = profile?.district ?? PILOT_DISTRICT;
  const hasNearbyListings = hasListingDataForDistrict(district);
  const visible = posts.filter(
    (p) =>
      p.status === "active" &&
      p.type === feedType &&
      p.district === district &&
      postMatchesFeedCategory(p.category, feedCategory),
  );

  return (
    <div className="space-y-4 px-4 pb-4">
      <div className="-mx-2 flex items-center">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          className="rounded-full p-2 text-emerald-50"
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <header>
        {profile?.firstName ? (
          <h1 className="text-2xl font-bold">¡Bienvenida, {profile.firstName}!</h1>
        ) : null}
        <p className="mt-2 text-xs font-medium text-ink-muted">Tu distrito</p>
        <h2 className="text-xl font-bold">{district}</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Regalos y pedidos cerca de ti, sin precio.
        </p>
        {hasNearbyListings && visible.length > 0 ? (
          <p className="mt-2 inline-block rounded-full bg-white px-3.5 py-1.5 shadow-md ring-1 ring-emerald-900/15">
            <span className="text-xs font-semibold text-ink">
              {visible.length} publicaciones cerca de ti en {district}
            </span>
          </p>
        ) : null}
      </header>

      <TypeTabs value={feedType} onChange={setFeedType} />
      <CategoryChips value={feedCategory} onChange={setFeedCategory} />

      {visible.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-muted ring-1 ring-border">
          {hasNearbyListings ? (
            <>
              No hay publicaciones activas aquí. Prueba otra categoría o publica
              algo.
            </>
          ) : (
            <>
              Aún no hay publicaciones en {district}. Sé el primero en publicar
              algo, o busca otro distrito si te mudaste.
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {visible.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
