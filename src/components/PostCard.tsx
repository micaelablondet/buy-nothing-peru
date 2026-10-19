import { Link } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { PidoAskVisual } from "@/components/PidoAskVisual";
import { PostTypeBadge } from "@/components/PostTypeBadge";
import { SharePostButton } from "@/components/SharePostButton";
import { usePrototypeStore } from "@/store/prototypeStore";
import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);
  const author = getNeighbor(post.authorId);

  if (post.type === "pido") {
    return (
      <Link
        to={`/feed/${post.id}`}
        className="flex gap-3 overflow-hidden rounded-2xl bg-surface-elevated p-3 shadow-sm ring-1 ring-border transition active:scale-[0.99]"
      >
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl">
          <PidoAskVisual variant="card" />
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <PostTypeBadge type={post.type} />
            <div className="flex items-center gap-1">
              <SharePostButton post={post} />
              <span className="text-xs text-ink-muted">{post.district}</span>
            </div>
          </div>
          <h2 className="line-clamp-2 text-base font-semibold leading-snug">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-snug text-ink-muted">
            {post.description}
          </p>
          <span className="text-sm font-semibold text-brand">Ver más →</span>
          <div className="flex items-center gap-2 pt-0.5">
            {author ? (
              <>
                <Avatar
                  name={author.firstName}
                  color={author.avatarColor}
                  size="sm"
                />
                <span className="text-xs text-ink-muted">{author.firstName}</span>
              </>
            ) : null}
            <span className="ml-auto text-xs text-ink-muted">{post.category}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/feed/${post.id}`}
      className="block overflow-hidden rounded-2xl bg-surface-elevated shadow-sm ring-1 ring-border transition active:scale-[0.99]"
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-white">
        {post.imageUrls[0] ? (
          <img
            src={post.imageUrls[0]}
            alt=""
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="space-y-2 p-3">
        <div className="flex items-center justify-between gap-2">
          <PostTypeBadge type={post.type} />
          <div className="flex items-center gap-1">
            <SharePostButton post={post} />
            <span className="text-xs text-ink-muted">{post.district}</span>
          </div>
        </div>
        <h2 className="line-clamp-2 text-base font-semibold leading-snug">
          {post.title}
        </h2>
        <div className="flex items-center gap-2">
          {author ? (
            <>
              <Avatar
                name={author.firstName}
                color={author.avatarColor}
                size="sm"
              />
              <span className="text-xs text-ink-muted">{author.firstName}</span>
            </>
          ) : null}
          <span className="ml-auto text-xs text-ink-muted">{post.category}</span>
        </div>
      </div>
    </Link>
  );
}
