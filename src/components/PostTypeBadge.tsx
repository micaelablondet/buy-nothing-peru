import { postCardTypeLabels } from "@/lib/postLabels";
import type { PostType } from "@/lib/types";

const styles: Record<PostType, string> = {
  regalo: "bg-brand-soft text-accent-regalo",
  pido: "bg-sky-100 text-accent-pido",
  presto: "bg-amber-100 text-accent-presto",
};

export function PostTypeBadge({ type }: { type: PostType }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[type]}`}
    >
      {postCardTypeLabels[type]}
    </span>
  );
}
