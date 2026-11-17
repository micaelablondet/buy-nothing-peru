import { describe, expect, it } from "vitest";
import { DEFAULT_POST_CATEGORY, isPostCategory } from "./categories";

describe("POST-08 retired (DEC-28) — default category only", () => {
  it("uses Otros as the fixed DB default", () => {
    expect(DEFAULT_POST_CATEGORY).toBe("Otros");
    expect(isPostCategory(DEFAULT_POST_CATEGORY)).toBe(true);
  });
});
