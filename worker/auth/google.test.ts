import { describe, expect, it } from "vitest";
import { GOOGLE_SCOPES, buildGoogleAuthUrl, googleRedirectUri } from "./google";
import type { WorkerEnv } from "../env";

const env = {
  GOOGLE_CLIENT_ID: "client-id",
  GOOGLE_CLIENT_SECRET: "secret",
  APP_BASE_URL: "http://127.0.0.1:8787",
} as WorkerEnv;

describe("Google OIDC (AUTH-01)", () => {
  it("requests only openid email profile", () => {
    expect(GOOGLE_SCOPES).toBe("openid email profile");
    const url = new URL(buildGoogleAuthUrl(env, "state-1"));
    expect(url.searchParams.get("scope")).toBe("openid email profile");
    expect(url.searchParams.get("client_id")).toBe("client-id");
    expect(url.searchParams.get("redirect_uri")).toBe(
      googleRedirectUri(env),
    );
  });
});
