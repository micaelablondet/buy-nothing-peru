import { describe, expect, it } from "vitest";
import {
  readReturnPath,
  sanitizeReturnPath,
} from "./returnPath";

describe("sanitizeReturnPath (PUB-04)", () => {
  it("allows public post and app paths", () => {
    expect(sanitizeReturnPath("/p/post-1")).toBe("/p/post-1");
    expect(sanitizeReturnPath("/p/abc?x=1")).toBe("/p/abc?x=1");
    expect(sanitizeReturnPath("/app")).toBe("/app");
    expect(sanitizeReturnPath("/app/p/x?responder=1")).toBe(
      "/app/p/x?responder=1",
    );
  });

  it("rejects open redirects and unknown paths", () => {
    expect(sanitizeReturnPath("https://evil.example/phish")).toBe(null);
    expect(sanitizeReturnPath("//evil.example")).toBe(null);
    expect(sanitizeReturnPath("/entrar")).toBe(null);
    expect(sanitizeReturnPath("/admin")).toBe(null);
    expect(sanitizeReturnPath(null)).toBe(null);
  });

  it("extracts path from same-origin absolute URL", () => {
    expect(sanitizeReturnPath("http://127.0.0.1:8787/p/post-1")).toBe(
      "/p/post-1",
    );
  });
});

describe("readReturnPath", () => {
  it("reads barrio_next cookie", () => {
    expect(
      readReturnPath("barrio_session=x; barrio_next=%2Fp%2Fpost-1; other=1"),
    ).toBe("/p/post-1");
  });
});
