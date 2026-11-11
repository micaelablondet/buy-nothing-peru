import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail (AUTH-04)", () => {
  it("matches allowlist case-insensitively", () => {
    expect(isAdminEmail("mica@valere.io", "mica@valere.io")).toBe(true);
    expect(isAdminEmail("Mica@Valere.io", "admin@x.com, mica@valere.io")).toBe(
      true,
    );
  });

  it("rejects others", () => {
    expect(isAdminEmail("other@example.com", "mica@valere.io")).toBe(false);
    expect(isAdminEmail(null, "mica@valere.io")).toBe(false);
  });
});
