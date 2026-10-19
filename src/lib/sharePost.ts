import { postCardTypeLabels } from "@/lib/postLabels";
import type { Post } from "@/lib/types";
import { buildPostShareMessage, getPostPublicUrl } from "@/lib/whatsapp";

export function buildPostSharePayload(post: Post): {
  title: string;
  text: string;
  url: string;
} {
  const typeLabel = postCardTypeLabels[post.type];
  const url = getPostPublicUrl(post.id) ?? "";
  const text = buildPostShareMessage({
    typeLabel,
    title: post.title,
    district: post.district,
    postUrl: url || undefined,
  });

  return {
    title: `${typeLabel}: ${post.title}`,
    text,
    url,
  };
}

/** Opens the device share sheet (Web Share API) when available. */
export async function sharePost(
  post: Post,
): Promise<"shared" | "copied" | "cancelled" | "unavailable"> {
  const payload = buildPostSharePayload(post);

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const shareData: ShareData = {
        title: payload.title,
        text: payload.text,
      };
      if (payload.url) {
        shareData.url = payload.url;
      }
      await navigator.share(shareData);
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text);
    return "copied";
  }

  return "unavailable";
}
