import { describe, expect, it } from "vitest";
import { dayWindowStart, hourWindowEnd, clientIp } from "./rateLimit";

describe("rateLimit helpers (SAFE-04)", () => {
  it("day window is UTC midnight", () => {
    expect(dayWindowStart("2026-11-13T18:30:00.000Z")).toBe(
      "2026-11-13T00:00:00.000Z",
    );
  });

  it("hour window ends at next UTC hour", () => {
    expect(hourWindowEnd("2026-11-13T18:30:00.000Z")).toBe(
      "2026-11-13T19:00:00.000Z",
    );
  });

  it("prefers CF-Connecting-IP", () => {
    expect(clientIp("1.1.1.1, 2.2.2.2", "9.9.9.9")).toBe("9.9.9.9");
    expect(clientIp("1.1.1.1, 2.2.2.2", undefined)).toBe("1.1.1.1");
  });
});
