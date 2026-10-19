import type { MouseEvent } from "react";
import { sharePost } from "@/lib/sharePost";
import type { Post } from "@/lib/types";
import { usePrototypeStore } from "@/store/prototypeStore";

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className ?? "h-5 w-5"}
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3v10M12 3l4 4M12 3 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type SharePostButtonProps = {
  post: Post;
  /** Header on gradient vs on white feed cards */
  variant?: "on-gradient" | "on-card";
  className?: string;
};

export function SharePostButton({
  post,
  variant = "on-card",
  className = "",
}: SharePostButtonProps) {
  const showToast = usePrototypeStore((s) => s.showToast);

  const onClick = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const result = await sharePost(post);
    if (result === "shared") {
      showToast("Listo — comparte con quien quieras.");
      return;
    }
    if (result === "copied") {
      showToast("Copiamos el enlace al portapapeles.");
      return;
    }
    if (result === "cancelled") {
      return;
    }
    showToast("Compartir no está disponible en este navegador.");
  };

  const tone =
    variant === "on-gradient"
      ? "rounded-full p-2 text-emerald-50 hover:bg-white/10"
      : "rounded-full p-1.5 text-ink-muted hover:bg-black/5";

  return (
    <button
      type="button"
      aria-label="Compartir publicación"
      onClick={onClick}
      className={`${tone} ${className}`.trim()}
    >
      <ShareIcon className={variant === "on-gradient" ? "h-6 w-6" : "h-5 w-5"} />
    </button>
  );
}
