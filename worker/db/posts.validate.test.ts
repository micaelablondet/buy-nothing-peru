import { describe, expect, it } from "vitest";
import { validatePostInput } from "./posts";

describe("validatePostInput (POST-01/02/08)", () => {
  it("requires 1–3 photos for Regalo", () => {
    expect(
      validatePostInput({
        type: "regalo",
        title: "Silla",
        description: "Buena",
        category: "Muebles",
        photoCount: 0,
      }).ok,
    ).toBe(false);
    expect(
      validatePostInput({
        type: "regalo",
        title: "Silla",
        description: "Buena",
        category: "Muebles",
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
        category: "Muebles",
        photoCount: 0,
      }).ok,
    ).toBe(true);
  });
});
