import { describe, expect, it } from "vitest";
import { shouldNudge } from "./nudge";

describe("nudge job (NOTIF-04)", () => {
  const base = {
    id: "post-1",
    author_id: "user-1",
    status: "open",
    nudge_sent_at: null as string | null,
    first_response_at: "2026-11-01T00:00:00.000Z",
  };

  it("nudges open posts 48h after first response once", () => {
    expect(
      shouldNudge(base, "2026-11-03T00:00:00.000Z"),
    ).toBe(true);
    expect(
      shouldNudge(
        { ...base, nudge_sent_at: "2026-11-03T00:00:00.000Z" },
        "2026-11-04T00:00:00.000Z",
      ),
    ).toBe(false);
  });

  it("skips chosen posts and young responses", () => {
    expect(
      shouldNudge({ ...base, status: "chosen" }, "2026-11-10T00:00:00.000Z"),
    ).toBe(false);
    expect(
      shouldNudge(base, "2026-11-01T12:00:00.000Z"),
    ).toBe(false);
  });
});
