import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { PostCard } from "@/components/PostCard";
import { ReportButton } from "@/components/ReportButton";
import { usePrototypeStore } from "@/store/prototypeStore";

export function NeighborProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const posts = usePrototypeStore((s) => s.posts);
  const currentUserId = usePrototypeStore((s) => s.currentUserId);
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);

  if (!userId) {
    return <Navigate to="/feed" replace />;
  }

  if (userId === currentUserId) {
    return <Navigate to="/perfil" replace />;
  }

  const neighbor = getNeighbor(userId);
  if (!neighbor) {
    return (
      <div className="space-y-4 px-4 pb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-emerald-50"
        >
          ← Volver
        </button>
        <p className="text-sm text-emerald-100/90">Vecino no encontrado.</p>
        <Link to="/feed" className="text-sm font-semibold text-emerald-50">
          Ir al inicio
        </Link>
      </div>
    );
  }

  const neighborPosts = posts
    .filter((p) => p.authorId === userId && p.status === "active")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <div className="space-y-5 px-4 pb-8">
      <header className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-emerald-50"
        >
          ← Volver
        </button>
        <h1 className="flex-1 text-center text-lg font-bold">Perfil</h1>
        <span className="w-14" aria-hidden />
      </header>

      <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
        <div className="flex flex-col items-center text-center">
          <Avatar
            name={neighbor.firstName}
            color={neighbor.avatarColor}
            size="lg"
          />
          <h2 className="mt-4 text-2xl font-bold leading-tight text-ink">
            {neighbor.firstName}
          </h2>
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-ink">
            <span aria-hidden>📍</span>
            {neighbor.district}, Lima
          </p>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-bold">Publicaciones</h2>
        {neighborPosts.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-center text-sm text-ink-muted ring-1 ring-border">
            No hay publicaciones abiertas.
          </div>
        ) : (
          <div className="grid gap-3">
            {neighborPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <div className="border-t border-white/20 pt-4">
        <ReportButton context="perfil" />
      </div>
    </div>
  );
}
