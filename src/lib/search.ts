import type { Post } from "@/lib/types";

/** Lowercase and strip accents so "lampara" matches "Lámpara". */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function postMatchesQuery(post: Post, query: string): boolean {
  const q = normalizeText(query);
  if (!q) {
    return true;
  }
  const haystack = normalizeText(
    `${post.title} ${post.description} ${post.category}`,
  );
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

/** Short Spanish relative time: "hace 3 h", "hace 2 días". */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const minutes = Math.max(
    0,
    Math.floor((now.getTime() - new Date(iso).getTime()) / 60000),
  );
  if (minutes < 60) {
    return minutes <= 1 ? "hace un momento" : `hace ${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `hace ${hours} h`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return days === 1 ? "hace 1 día" : `hace ${days} días`;
  }
  const months = Math.floor(days / 30);
  return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
}
