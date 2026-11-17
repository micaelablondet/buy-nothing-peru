import { describe, expect, it } from "vitest";
import { isAdminEmail } from "./admin";

describe("isAdminEmail (AUTH-04)", () => {
  it("matches allowlist case-insensitively", () => {
    expect(isAdminEmail("mica@example.test", "mica@example.test")).toBe(true);
    expect(
      isAdminEmail("Mica@Example.test", "admin@x.com, mica@example.test"),
    ).toBe(true);
  });

  it("rejects others", () => {
    expect(isAdminEmail("other@example.com", "mica@example.test")).toBe(false);
    expect(isAdminEmail(null, "mica@example.test")).toBe(false);
  });
});
