import { describe, expect, it } from "vitest";
import { validatePostInput } from "./posts";

describe("validatePostInput (POST-01/02, DEC-28)", () => {
  it("requires 1–3 photos for Regalo (no category)", () => {
    expect(
      validatePostInput({
        type: "regalo",
        title: "Silla",
        description: "Buena",
        photoCount: 0,
      }).ok,
    ).toBe(false);
    expect(
      validatePostInput({
        type: "regalo",
        title: "Silla",
        description: "Buena",
        photoCount: 2,
      }).ok,
    ).toBe(true);
  });

  it("allows Pido with zero photos", () => {
    expect(
      validatePostInput({
        type: "pido",
        title: "Mesa",
        description: "Busco una",
        photoCount: 0,
      }).ok,
    ).toBe(true);
  });
});
