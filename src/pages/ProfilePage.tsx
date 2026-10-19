import { Link } from "react-router-dom";
import { ProfileActivePostCard } from "@/components/ProfileActivePostCard";
import { ProfileEditSheet } from "@/components/ProfileEditSheet";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { formatMemberSince } from "@/lib/formatTime";
import type { PostType } from "@/lib/types";
import {
  DEMO_USER_ID,
  defaultProfile,
  usePrototypeStore,
} from "@/store/prototypeStore";
import { useState } from "react";

type ProfileTab = "publicaciones" | "guardados";
type TypeFilter = PostType | "all";

export function ProfilePage() {
  const profile = usePrototypeStore((s) => s.profile);
  const posts = usePrototypeStore((s) => s.posts);
  const interests = usePrototypeStore((s) => s.interests);
  const savedPostIds = usePrototypeStore((s) => s.savedPostIds);
  const ravesCount = usePrototypeStore((s) => s.ravesCount);
  const markGiven = usePrototypeStore((s) => s.markGiven);
  const showToast = usePrototypeStore((s) => s.showToast);
  const updateProfile = usePrototypeStore((s) => s.updateProfile);
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);

  const [tab, setTab] = useState<ProfileTab>("publicaciones");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [editOpen, setEditOpen] = useState(false);

  const meProfile = profile ?? defaultProfile;
  const me = getNeighbor(DEMO_USER_ID);
  const displayName = meProfile.firstName;
  const district = meProfile.district;
  const memberSince =
    meProfile.memberSince ?? defaultProfile.memberSince ?? "2026-07-01T00:00:00.000Z";

  const myPosts = posts.filter((p) => p.authorId === DEMO_USER_ID);
  const myActivePosts = myPosts
    .filter((p) => p.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const allMyPostsSorted = [...myPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const savedPosts = savedPostIds
    .map((id) => posts.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const filterByType = <T extends { type: PostType }>(items: T[]) =>
    typeFilter === "all" ? items : items.filter((p) => p.type === typeFilter);

  const tabPosts =
    tab === "publicaciones"
      ? filterByType(allMyPostsSorted)
      : filterByType(savedPosts);

  return (
    <div className="space-y-5 px-4 pb-8">
      <header className="flex items-center justify-between pt-1">
        <h1 className="text-lg font-bold">Mi perfil</h1>
        <button
          type="button"
          className="rounded-full p-2 text-emerald-50"
          aria-label="Editar perfil"
          onClick={() => setEditOpen(true)}
        >
          ✎
        </button>
      </header>

      <ProfileEditSheet
        open={editOpen}
        profile={meProfile}
        onClose={() => setEditOpen(false)}
        onSave={(patch) => {
          updateProfile(patch);
          showToast("Perfil actualizado.");
        }}
        onError={(message) => showToast(message)}
      />

      <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
        <div className="flex flex-col items-center text-center">
          {me ? (
            <Avatar
              name={displayName}
              color={me.avatarColor}
              size="lg"
              imageUrl={me.avatarImageUrl}
            />
          ) : null}
          <h2 className="mt-4 text-2xl font-bold leading-tight">
            Hola, soy {displayName}
          </h2>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-ink">
            <span aria-hidden>📍</span>
            {district}, Lima
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand"
            onClick={() =>
              showToast("Próximamente: vecinos que hablaron bien de ti.")
            }
          >
            <span aria-hidden className="text-base">
              💚
            </span>
            {ravesCount} vecino{ravesCount === 1 ? "" : "s"} hablaron bien de ti
          </button>
          <p className="mt-3 text-xs text-ink-muted">
            {formatMemberSince(memberSince)}
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold">Tus Regalos y Pedidos</h2>
        {myActivePosts.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-ink-muted ring-1 ring-border">
            <p>No tienes publicaciones abiertas.</p>
            <Link
              to="/publicar"
              className="mt-3 inline-block font-semibold text-brand"
            >
              Publicar
            </Link>
          </div>
        ) : (
          myActivePosts.map((post) => (
            <ProfileActivePostCard
              key={post.id}
              post={post}
              interestCount={(interests[post.id] ?? []).length}
              onMarkClosed={() => {
                markGiven(post.id);
                showToast("Publicación marcada como entregada / resuelta.");
              }}
            />
          ))
        )}
      </section>

      <section className="space-y-3">
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setTab("publicaciones")}
            className={`flex-1 border-b-2 pb-2 text-sm font-semibold ${
              tab === "publicaciones"
                ? "border-brand text-brand"
                : "border-transparent text-ink-muted"
            }`}
          >
            Tus publicaciones {myPosts.length}
          </button>
          <button
            type="button"
            onClick={() => setTab("guardados")}
            className={`flex-1 border-b-2 pb-2 text-sm font-semibold ${
              tab === "guardados"
                ? "border-brand text-brand"
                : "border-transparent text-ink-muted"
            }`}
          >
            Guardados {savedPosts.length}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", "Todos"],
              ["regalo", "Regalos"],
              ["pido", "Pedidos"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTypeFilter(value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                typeFilter === value
                  ? "bg-brand text-white"
                  : "bg-white text-ink-muted ring-1 ring-border"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tabPosts.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-ink-muted ring-1 ring-border">
            {tab === "guardados"
              ? "Aún no guardaste publicaciones. Usa el ícono de guardar en el feed."
              : "Publica tu primer Regalo o Pido."}
            {tab === "publicaciones" ? (
              <Link
                to="/publicar"
                className="mt-3 block font-semibold text-brand"
              >
                Publicar
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-3">
            {tabPosts.map((post) =>
              post.status === "given" ? (
                <div
                  key={post.id}
                  className="rounded-2xl bg-white p-4 opacity-75 ring-1 ring-border"
                >
                  <p className="text-xs font-semibold text-ink-muted">
                    Ya no disponible
                  </p>
                  <p className="mt-1 font-semibold">{post.title}</p>
                </div>
              ) : (
                <PostCard key={post.id} post={post} />
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}
