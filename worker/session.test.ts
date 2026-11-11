import { describe, expect, it } from "vitest";
import type { SessionUser, WorkerEnv } from "./env";
import {
  clearSessionCookie,
  readSession,
  sessionSetCookie,
  signPendingToken,
  readPending,
  pendingSetCookie,
} from "./session";

const secret = "test-session-secret-32chars!!";

const env = {
  SESSION_SECRET: secret,
  ENVIRONMENT: "development",
  APP_BASE_URL: "http://127.0.0.1:8787",
} as WorkerEnv;

const user: SessionUser = {
  id: "user-1",
  displayName: "Mica",
  email: "mica@valere.io",
  districtId: "dist-barranco",
  whatsapp: "+51987654321",
  inviteAcceptedAt: "2026-11-10T00:00:00.000Z",
  isAdmin: true,
  profileComplete: true,
};

describe("signed session cookie (AUTH-03)", () => {
  it("round-trips a session user", async () => {
    const header = await sessionSetCookie(env, user);
    const token = header.split(";")[0]?.split("=")[1];
    expect(token).toBeTruthy();
    const parsed = await readSession(`barrio_session=${token}`, secret);
    expect(parsed?.id).toBe("user-1");
    expect(parsed?.displayName).toBe("Mica");
    expect(parsed?.profileComplete).toBe(true);
  });

  it("clears with Max-Age=0", () => {
    expect(clearSessionCookie(env)).toContain("Max-Age=0");
  });

  it("stores pending Google identity", async () => {
    const set = await pendingSetCookie(env, {
      googleSub: "sub-1",
      email: "a@b.com",
      displayName: "Ana",
    });
    const token = set.split(";")[0]?.split("=")[1] ?? "";
    const pending = await readPending(`barrio_pending=${token}`, secret);
    expect(pending?.googleSub).toBe("sub-1");
    const signed = await signPendingToken(
      { googleSub: "x", email: "e", displayName: "D" },
      secret,
    );
    expect(signed.length).toBeGreaterThan(20);
  });
});
