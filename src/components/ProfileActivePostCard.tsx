import { Link } from "react-router-dom";
import { PidoAskVisual } from "@/components/PidoAskVisual";
import { formatTimeAgoEs } from "@/lib/formatTime";
import type { Post } from "@/lib/types";

export function ProfileActivePostCard({
  post,
  interestCount,
  onMarkClosed,
}: {
  post: Post;
  interestCount: number;
  onMarkClosed: () => void;
}) {
  const countLabel =
    post.type === "pido"
      ? `${interestCount} oferta${interestCount === 1 ? "" : "s"}`
      : `${interestCount} interesado${interestCount === 1 ? "" : "s"}`;

  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-border">
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
          {post.type === "pido" ? (
            <PidoAskVisual variant="card" />
          ) : post.imageUrls[0] ? (
            <img
              src={post.imageUrls[0]}
              alt=""
              className="h-full w-full object-contain bg-white"
            />
          ) : (
            <div className="h-full w-full bg-brand-soft" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold leading-snug">{post.title}</p>
            <span className="shrink-0 text-xs text-ink-muted">
              {formatTimeAgoEs(post.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {post.type === "pido" ? "Pedido" : "Regalo"} · {post.district}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {interestCount > 0 ? (
          <Link
            to={`/feed/${post.id}/elegir`}
            className="text-sm font-semibold text-brand"
          >
            {post.type === "pido" ? "Ver ofertas" : "Ver interesados"} →
          </Link>
        ) : (
          <span className="text-sm text-ink-muted">{countLabel}</span>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onMarkClosed}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink-muted ring-1 ring-border"
          >
            Actualizar estado
          </button>
          <Link
            to={`/feed/${post.id}`}
            className="rounded-full p-1.5 text-ink-muted ring-1 ring-border"
            aria-label="Editar publicación"
          >
            ✎
          </Link>
        </div>
      </div>
    </div>
  );
}
