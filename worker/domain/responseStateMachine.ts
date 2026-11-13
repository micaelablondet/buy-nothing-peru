/** Response status transitions — SPEC.md §7.4. */

export type ResponseStatus = "active" | "chosen" | "not_chosen" | "withdrawn";

export type ResponseTransition = "choose" | "not_choose" | "withdraw";

const ALLOWED: Record<ResponseTransition, ReadonlyArray<ResponseStatus>> = {
  choose: ["active"],
  not_choose: ["active"],
  withdraw: ["active"],
};

const RESULT: Record<ResponseTransition, ResponseStatus> = {
  choose: "chosen",
  not_choose: "not_chosen",
  withdraw: "withdrawn",
};

export type ResponseTransitionResult =
  | {
      ok: true;
      from: ResponseStatus;
      to: ResponseStatus;
      transition: ResponseTransition;
    }
  | {
      ok: false;
      error: "illegal_transition";
      from: ResponseStatus;
      transition: ResponseTransition;
    };

export function applyResponseTransition(
  from: ResponseStatus,
  transition: ResponseTransition,
): ResponseTransitionResult {
  if (!ALLOWED[transition].includes(from)) {
    return { ok: false, error: "illegal_transition", from, transition };
  }
  return {
    ok: true,
    from,
    to: RESULT[transition],
    transition,
  };
}

export const MAX_ACTIVE_RESPONSES = 7;
