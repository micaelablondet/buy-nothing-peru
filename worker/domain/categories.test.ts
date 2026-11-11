import { describe, expect, it } from "vitest";
import { POST_CATEGORIES, isPostCategory } from "./categories";

describe("POST-08 categories", () => {
  it("includes the fixed Phase 0 list", () => {
    expect(POST_CATEGORIES).toContain("Ropa");
    expect(POST_CATEGORIES).toContain("Electrónica");
    expect(POST_CATEGORIES).toContain("Hogar y cocina");
    expect(POST_CATEGORIES).toHaveLength(10);
  });

  it("rejects unknown categories", () => {
    expect(isPostCategory("Electrónicos")).toBe(false);
    expect(isPostCategory("Otros")).toBe(true);
  });
});
