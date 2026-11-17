import { describe, expect, it } from "vitest";
import { mustEnterInviteCode } from "./inviteGate";

describe("mustEnterInviteCode (AUTH-02 / DEC-30)", () => {
  it("does not require invite when INVITE_REQUIRED is off", () => {
    expect(
      mustEnterInviteCode(false, "vecino@example.test", "mica@example.test", true),
    ).toBe(false);
  });

  it("skips invite for verified ADMIN_EMAILS bootstrap", () => {
    expect(
      mustEnterInviteCode(true, "mica@example.test", "mica@example.test", true),
    ).toBe(false);
    expect(
      mustEnterInviteCode(
        true,
        "Mica@Example.test",
        "admin@x.com, mica@example.test",
        true,
      ),
    ).toBe(false);
  });

  it("still requires invite for allowlisted email when email_verified is false", () => {
    expect(
      mustEnterInviteCode(true, "mica@example.test", "mica@example.test", false),
    ).toBe(true);
  });

  it("requires invite for non-admin when INVITE_REQUIRED is on", () => {
    expect(
      mustEnterInviteCode(true, "vecino@example.test", "mica@example.test", true),
    ).toBe(true);
    expect(mustEnterInviteCode(true, "vecino@example.test", "", true)).toBe(true);
    expect(mustEnterInviteCode(true, null, "mica@example.test", true)).toBe(true);
  });
});
