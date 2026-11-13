import { describe, expect, it } from "vitest";
import { median, startOfIsoWeekLima, endOfIsoWeekLima } from "./metrics";

describe("metrics helpers (ADMIN-03)", () => {
  it("computes median", () => {
    expect(median([])).toBe(null);
    expect(median([3])).toBe(3);
    expect(median([1, 3, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("bounds ISO week in America/Lima", () => {
    // Wednesday 2026-11-11 15:00 UTC = 10:00 Lima → week starting Monday 2026-11-09 05:00 UTC
    const start = startOfIsoWeekLima("2026-11-11T15:00:00.000Z");
    const end = endOfIsoWeekLima("2026-11-11T15:00:00.000Z");
    expect(start).toBe("2026-11-09T05:00:00.000Z");
    expect(end).toBe("2026-11-16T05:00:00.000Z");
  });
});
