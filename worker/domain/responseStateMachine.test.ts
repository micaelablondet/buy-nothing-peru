import { describe, expect, it } from "vitest";
import {
  MAX_ACTIVE_RESPONSES,
  applyResponseTransition,
} from "./responseStateMachine";

describe("responseStateMachine (SPEC §7.4)", () => {
  it("allows active → chosen / not_chosen / withdrawn", () => {
    expect(applyResponseTransition("active", "choose")).toMatchObject({
      to: "chosen",
    });
    expect(applyResponseTransition("active", "not_choose")).toMatchObject({
      to: "not_chosen",
    });
    expect(applyResponseTransition("active", "withdraw")).toMatchObject({
      to: "withdrawn",
    });
  });

  it("rejects illegal transitions", () => {
    expect(applyResponseTransition("chosen", "withdraw").ok).toBe(false);
    expect(applyResponseTransition("withdrawn", "choose").ok).toBe(false);
  });

  it("caps active responses at 7 (RESP-05)", () => {
    expect(MAX_ACTIVE_RESPONSES).toBe(7);
  });
});
