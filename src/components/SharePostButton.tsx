import { useState } from "react";
import { copy } from "@/copy/es-PE";
import { recordShareClick } from "@/lib/api";

/** PUB-03: Compartir en WhatsApp + share_clicked. */
export function SharePostButton({ postId }: { postId: string }) {
  const [busy, setBusy] = useState(false);

  const onShare = async () => {
    setBusy(true);
    try {
      const { url } = await recordShareClick(postId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      const fallback = `${window.location.origin}/p/${postId}`;
      window.open(
        `https://wa.me/?text=${encodeURIComponent(fallback)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className="btn-secondary"
      disabled={busy}
      onClick={() => void onShare()}
    >
      {copy.post.shareWhatsApp}
    </button>
  );
}
