import { describe, expect, it } from "vitest";
import {
  clearSessionCookie,
  readStubSession,
  stubSessionCookie,
  STUB_USERS,
} from "./session";

describe("stub session cookie", () => {
  it("round-trips a stub user", () => {
    const header = stubSessionCookie(STUB_USERS.mica);
    const user = readStubSession(header);
    expect(user?.id).toBe("user-mica");
    expect(user?.firstName).toBe("Mica");
    expect(user?.isAdmin).toBe(true);
  });

  it("returns null for missing cookie", () => {
    expect(readStubSession(null)).toBeNull();
    expect(readStubSession("other=1")).toBeNull();
  });

  it("clears with Max-Age=0", () => {
    expect(clearSessionCookie()).toContain("Max-Age=0");
  });
});
