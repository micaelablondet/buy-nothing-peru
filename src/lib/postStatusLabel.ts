import { copy } from "@/copy/es-PE";
import type { PostType } from "@/lib/api";

type StatusKey = keyof typeof copy.post.statusPedido;

/** Visible status for a post; donaciones use feminine agreement (DEC-34). */
export function postStatusLabel(
  status: string,
  type: PostType,
): string {
  const map =
    type === "regalo" ? copy.post.statusDonacion : copy.post.statusPedido;
  return map[status as StatusKey] ?? status;
}
