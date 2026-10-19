import { Link } from "react-router-dom";
import { Avatar } from "@/components/Avatar";
import { PidoAskVisual } from "@/components/PidoAskVisual";
import { postCardTypeLabels } from "@/lib/postLabels";
import { timeAgo } from "@/lib/search";
import type { Post, PostType } from "@/lib/types";
import { usePrototypeStore } from "@/store/prototypeStore";

const labelStyles: Record<PostType, string> = {
  regalo: "bg-accent-regalo text-white",
  pido: "bg-white text-[#2563eb] ring-2 ring-[#2563eb]",
  presto: "bg-accent-presto text-white",
};

function TypeIcon({ type }: { type: PostType }) {
  if (type === "pido") {
    return (
      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
        <path
          d="M8 7.5a2 2 0 1 1 2.8 1.8c-.5.3-.8.7-.8 1.2V11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="3" y="8" width="14" height="9" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M2 5.5h16V8H2zM10 5.5V17" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 5.5C8.5 2.5 5.5 3 6 4.5S10 5.5 10 5.5zm0 0c1.5-3 4.5-2.5 4-1S10 5.5 10 5.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchResultCard({ post }: { post: Post }) {
  const getNeighbor = usePrototypeStore((s) => s.getNeighbor);
  const author = getNeighbor(post.authorId);

  return (
    <Link
      to={`/feed/${post.id}`}
      className="block min-w-0 transition active:scale-[0.98]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white ring-1 ring-border">
        {post.type === "pido" ? (
          <PidoAskVisual variant="card" />
        ) : post.imageUrls[0] ? (
          <img
            src={post.imageUrls[0]}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <span
          className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold shadow-sm ${labelStyles[post.type]}`}
        >
          <TypeIcon type={post.type} />
          {postCardTypeLabels[post.type]}
        </span>
      </div>
      <div className="space-y-1 px-0.5 pt-2">
        <h2 className="line-clamp-2 text-sm font-semibold leading-snug">
          {post.title}
        </h2>
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-ink-muted">
          {author ? (
            <>
              <Avatar name={author.firstName} color={author.avatarColor} size="sm" />
              <span className="truncate">{author.firstName}</span>
              <span aria-hidden>·</span>
            </>
          ) : null}
          <span className="shrink-0">{timeAgo(post.createdAt)}</span>
        </div>
        <p className="truncate text-xs text-ink-muted">📍 {post.district}</p>
      </div>
    </Link>
  );
}
