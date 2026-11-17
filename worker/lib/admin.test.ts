import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail (AUTH-04)", () => {
  it("treats allowlisted email as admin only when email_verified is true", () => {
    expect(
      isAdminEmail("mica@example.test", "mica@example.test", true),
    ).toBe(true);
    expect(
      isAdminEmail("Mica@Example.test", "admin@x.com, mica@example.test", true),
    ).toBe(true);
  });

  it("never treats allowlisted email as admin when email_verified is false", () => {
    expect(
      isAdminEmail("mica@example.test", "mica@example.test", false),
    ).toBe(false);
  });

  it("rejects non-allowlisted or missing emails even when verified", () => {
    expect(isAdminEmail("other@example.com", "mica@example.test", true)).toBe(
      false,
    );
    expect(isAdminEmail(null, "mica@example.test", true)).toBe(false);
  });
});
