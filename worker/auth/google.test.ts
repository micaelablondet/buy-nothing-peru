import { describe, expect, it } from "vitest";
import { identityFromGoogleUserinfo } from "./google";

describe("identityFromGoogleUserinfo", () => {
  it("sets emailVerified true when Google reports email_verified", () => {
    const identity = identityFromGoogleUserinfo({
      sub: "google-sub-1",
      email: "mica@example.test",
      email_verified: true,
      given_name: "Mica",
    });
    expect(identity).toEqual({
      googleSub: "google-sub-1",
      email: "mica@example.test",
      displayName: "Mica",
      emailVerified: true,
    });
  });

  it("sets emailVerified false when Google reports email_verified false", () => {
    const identity = identityFromGoogleUserinfo({
      sub: "google-sub-2",
      email: "mica@example.test",
      email_verified: false,
      name: "Mica Blondet",
    });
    expect(identity.emailVerified).toBe(false);
    expect(identity.displayName).toBe("Mica Blondet");
  });

  it("sets emailVerified false when email_verified is missing", () => {
    const identity = identityFromGoogleUserinfo({
      sub: "google-sub-3",
      email: "vecino@example.test",
    });
    expect(identity.emailVerified).toBe(false);
    expect(identity.displayName).toBe("vecino");
  });
});
