import { describe, expect, it } from "vitest";
import {
  applyPostTransition,
  canTransition,
  shouldExpire,
} from "./postStateMachine";

describe("postStateMachine (SPEC §7.3)", () => {
  it("allows open → chosen / expired / withdrawn / removed", () => {
    expect(applyPostTransition("open", "choose")).toEqual({
      ok: true,
      from: "open",
      to: "chosen",
      transition: "choose",
    });
    expect(applyPostTransition("open", "expire")?.ok && applyPostTransition("open", "expire")).toMatchObject({
      to: "expired",
    });
    expect(applyPostTransition("open", "withdraw")).toMatchObject({ to: "withdrawn" });
    expect(canTransition("open", "remove")).toBe(true);
  });

  it("allows chosen → delivered / withdrawn / closed / removed", () => {
    expect(applyPostTransition("chosen", "deliver")).toMatchObject({ to: "delivered" });
    expect(applyPostTransition("chosen", "withdraw")).toMatchObject({ to: "withdrawn" });
    expect(applyPostTransition("chosen", "close_stale_chosen")).toMatchObject({
      to: "closed",
    });
  });

  it("rejects illegal transitions (POST-05/06)", () => {
    expect(applyPostTransition("chosen", "expire").ok).toBe(false);
    expect(applyPostTransition("delivered", "withdraw").ok).toBe(false);
    expect(applyPostTransition("expired", "choose").ok).toBe(false);
    expect(applyPostTransition("open", "deliver").ok).toBe(false);
  });

  it("shouldExpire only for open past expires_at", () => {
    expect(shouldExpire("open", "2026-11-01T00:00:00.000Z", "2026-11-08T00:00:00.000Z")).toBe(
      true,
    );
    expect(shouldExpire("chosen", "2026-11-01T00:00:00.000Z", "2026-11-08T00:00:00.000Z")).toBe(
      false,
    );
    expect(shouldExpire("open", "2026-11-20T00:00:00.000Z", "2026-11-08T00:00:00.000Z")).toBe(
      false,
    );
  });
});
