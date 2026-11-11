/** Post status transitions — SPEC.md §7.3. Only this module decides legality. */

export type PostStatus =
  | "open"
  | "chosen"
  | "delivered"
  | "withdrawn"
  | "expired"
  | "removed"
  | "closed";

export type PostTransition =
  | "choose"
  | "deliver"
  | "expire"
  | "withdraw"
  | "remove"
  | "close_stale_chosen";

const ALLOWED: Record<PostTransition, ReadonlyArray<PostStatus>> = {
  choose: ["open"],
  deliver: ["chosen"],
  expire: ["open"],
  withdraw: ["open", "chosen"],
  remove: ["open", "chosen", "delivered", "withdrawn", "expired", "closed"],
  close_stale_chosen: ["chosen"],
};

const RESULT: Record<PostTransition, PostStatus> = {
  choose: "chosen",
  deliver: "delivered",
  expire: "expired",
  withdraw: "withdrawn",
  remove: "removed",
  close_stale_chosen: "closed",
};

export type TransitionResult =
  | { ok: true; from: PostStatus; to: PostStatus; transition: PostTransition }
  | { ok: false; error: "illegal_transition"; from: PostStatus; transition: PostTransition };

export function canTransition(
  from: PostStatus,
  transition: PostTransition,
): boolean {
  return ALLOWED[transition].includes(from);
}

export function applyPostTransition(
  from: PostStatus,
  transition: PostTransition,
): TransitionResult {
  if (!canTransition(from, transition)) {
    return { ok: false, error: "illegal_transition", from, transition };
  }
  return {
    ok: true,
    from,
    to: RESULT[transition],
    transition,
  };
}

/** POST-06: open posts past expires_at become expired. */
export function shouldExpire(status: PostStatus, expiresAt: string | null, nowIso: string): boolean {
  if (status !== "open" || !expiresAt) {
    return false;
  }
  return expiresAt <= nowIso;
}
