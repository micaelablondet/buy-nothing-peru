import { describe, expect, it } from "vitest";
import { mustEnterInviteCode } from "./inviteGate";

describe("mustEnterInviteCode (AUTH-02 / DEC-30)", () => {
  it("skips invite when INVITE_REQUIRED is false", () => {
    expect(
      mustEnterInviteCode(false, "vecino@example.test", "mica@example.test"),
    ).toBe(false);
  });

  it("skips invite for emails in ADMIN_EMAILS when invite is required", () => {
    expect(
      mustEnterInviteCode(true, "mica@example.test", "mica@example.test"),
    ).toBe(false);
    expect(
      mustEnterInviteCode(
        true,
        "Mica@Example.test",
        "other@x.com, mica@example.test",
      ),
    ).toBe(false);
  });

  it("requires invite for non-admin emails when invite is required", () => {
    expect(
      mustEnterInviteCode(true, "vecino@example.test", "mica@example.test"),
    ).toBe(true);
    expect(mustEnterInviteCode(true, "vecino@example.test", "")).toBe(true);
    expect(mustEnterInviteCode(true, null, "mica@example.test")).toBe(true);
  });
});
