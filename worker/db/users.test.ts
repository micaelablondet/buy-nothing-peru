import { describe, expect, it, vi } from "vitest";
import { deleteAccount } from "./users";

describe("deleteAccount (PROF-04)", () => {
  it("deletes the user's push_subscriptions rows", async () => {
    const pushDeleteRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const userUpdateRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const sqlSeen: string[] = [];

    const prepare = vi.fn((sql: string) => {
      sqlSeen.push(sql);
      if (sql.includes("SELECT id FROM posts")) {
        return {
          bind: () => ({
            all: async () => ({ results: [] }),
          }),
        };
      }
      if (sql.includes("DELETE FROM push_subscriptions WHERE user_id")) {
        return { bind: () => ({ run: pushDeleteRun }) };
      }
      if (sql.includes("UPDATE users SET")) {
        return { bind: () => ({ run: userUpdateRun }) };
      }
      return {
        bind: () => ({
          run: vi.fn(),
          all: async () => ({ results: [] }),
          first: async () => null,
        }),
      };
    });

    await deleteAccount({ prepare } as unknown as D1Database, "user-1");

    expect(
      sqlSeen.some((s) =>
        s.includes("DELETE FROM push_subscriptions WHERE user_id"),
      ),
    ).toBe(true);
    expect(pushDeleteRun).toHaveBeenCalled();
    expect(userUpdateRun).toHaveBeenCalled();
  });
});
