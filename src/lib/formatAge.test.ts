import { describe, expect, it } from "vitest";
import { formatPostAge } from "./formatAge";

describe("formatPostAge (POST-04)", () => {
  const now = Date.parse("2026-11-17T12:00:00.000Z");

  it("formats minutes as hace X min", () => {
    expect(formatPostAge("2026-11-17T11:59:00.000Z", now)).toBe("hace 1 min");
    expect(formatPostAge("2026-11-17T11:45:00.000Z", now)).toBe("hace 15 min");
  });

  it("formats hours as hace X h", () => {
    expect(formatPostAge("2026-11-17T11:00:00.000Z", now)).toBe("hace 1 h");
    expect(formatPostAge("2026-11-17T09:00:00.000Z", now)).toBe("hace 3 h");
  });

  it("formats one day as hace 1 día", () => {
    expect(formatPostAge("2026-11-16T12:00:00.000Z", now)).toBe("hace 1 día");
  });

  it("formats multiple days as hace X días", () => {
    expect(formatPostAge("2026-11-14T12:00:00.000Z", now)).toBe("hace 3 días");
  });
});
