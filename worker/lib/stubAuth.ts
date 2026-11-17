/**
 * DEV_STUB_AUTH must never enable stub sign-in when ENVIRONMENT is production.
 */
export function isStubAuthEnabled(env: {
  ENVIRONMENT: string;
  DEV_STUB_AUTH?: string;
}): boolean {
  return env.ENVIRONMENT !== "production" && env.DEV_STUB_AUTH === "true";
}
