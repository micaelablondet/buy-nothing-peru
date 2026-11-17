import { describe, expect, it } from "vitest";
import { resolveCorsOrigin } from "./cors";

describe("resolveCorsOrigin (SAFE-05)", () => {
  const prod = {
    APP_BASE_URL: "https://barrio.example",
    ENVIRONMENT: "production",
  };
  const dev = {
    APP_BASE_URL: "http://127.0.0.1:8787",
    ENVIRONMENT: "development",
  };

  it("allows APP_BASE_URL origin with credentials intent", () => {
    expect(resolveCorsOrigin(prod, "https://barrio.example")).toBe(
      "https://barrio.example",
    );
    expect(resolveCorsOrigin(dev, "http://127.0.0.1:8787")).toBe(
      "http://127.0.0.1:8787",
    );
  });

  it("allows Vite origin only when not production", () => {
    expect(resolveCorsOrigin(dev, "http://127.0.0.1:5173")).toBe(
      "http://127.0.0.1:5173",
    );
    expect(resolveCorsOrigin(dev, "http://localhost:5173")).toBe(
      "http://localhost:5173",
    );
    expect(resolveCorsOrigin(prod, "http://127.0.0.1:5173")).toBeNull();
  });

  it("never reflects a foreign Origin", () => {
    expect(resolveCorsOrigin(prod, "https://evil.example")).toBeNull();
    expect(resolveCorsOrigin(dev, "https://evil.example")).toBeNull();
    expect(resolveCorsOrigin(dev, null)).toBeNull();
    expect(resolveCorsOrigin(dev, undefined)).toBeNull();
  });
});
