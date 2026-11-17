import { describe, expect, it } from "vitest";
import { isStubAuthEnabled } from "./stubAuth";

describe("isStubAuthEnabled (launch)", () => {
  it("never enables stub auth in production, even if DEV_STUB_AUTH=true", () => {
    expect(
      isStubAuthEnabled({
        ENVIRONMENT: "production",
        DEV_STUB_AUTH: "true",
      }),
    ).toBe(false);
    expect(
      isStubAuthEnabled({
        ENVIRONMENT: "production",
        DEV_STUB_AUTH: undefined,
      }),
    ).toBe(false);
  });

  it("enables stub auth only in non-production when DEV_STUB_AUTH=true", () => {
    expect(
      isStubAuthEnabled({
        ENVIRONMENT: "development",
        DEV_STUB_AUTH: "true",
      }),
    ).toBe(true);
    expect(
      isStubAuthEnabled({
        ENVIRONMENT: "development",
        DEV_STUB_AUTH: "false",
      }),
    ).toBe(false);
    expect(
      isStubAuthEnabled({
        ENVIRONMENT: "development",
      }),
    ).toBe(false);
  });
});
