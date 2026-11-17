import { describe, expect, it } from "vitest";
import { sanitizeReturnPath } from "./returnPath";

describe("client sanitizeReturnPath (sign-in return-to)", () => {
  it("allows public post and app paths", () => {
    expect(sanitizeReturnPath("/p/post-1")).toBe("/p/post-1");
    expect(sanitizeReturnPath("/app")).toBe("/app");
    expect(sanitizeReturnPath("/app/p/x?responder=1")).toBe(
      "/app/p/x?responder=1",
    );
  });

  it("rejects external, protocol-relative, and backslash paths", () => {
    expect(sanitizeReturnPath("https://evil.example/phish")).toBe(null);
    expect(sanitizeReturnPath("//evil.example")).toBe(null);
    expect(sanitizeReturnPath("//evil.example/p/post-1")).toBe(null);
    expect(sanitizeReturnPath("\\evil.example")).toBe(null);
    expect(sanitizeReturnPath("/\\evil.example")).toBe(null);
    expect(sanitizeReturnPath("/app\\next")).toBe(null);
    expect(sanitizeReturnPath("/p/x%5cevil")).toBe(null);
  });
});
