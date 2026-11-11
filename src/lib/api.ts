export type MeResponse = {
  id: string;
  displayName: string;
  email: string | null;
  districtId: string | null;
  whatsapp: string | null;
  inviteAcceptedAt: string | null;
  isAdmin: boolean;
  profileComplete: boolean;
};

export type AuthConfig = {
  googleConfigured: boolean;
  inviteRequired: boolean;
  stubAuth: boolean;
};

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
}

export async function fetchAuthConfig(): Promise<AuthConfig> {
  const res = await fetch("/api/auth/config", { credentials: "include" });
  if (!res.ok) {
    throw new Error("config_failed");
  }
  return parseJson(res);
}

export async function fetchMe(): Promise<MeResponse | null> {
  const res = await fetch("/api/me", { credentials: "include" });
  if (res.status === 401) {
    return null;
  }
  if (!res.ok) {
    throw new Error("me_failed");
  }
  return parseJson<MeResponse>(res);
}

export async function startStubSession(): Promise<MeResponse> {
  const res = await fetch("/api/dev/session", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("session_failed");
  }
  const data = await parseJson<{ user: MeResponse }>(res);
  return data.user;
}

export async function submitInviteCode(
  code: string,
): Promise<{ user: MeResponse; next: string }> {
  const res = await fetch("/api/auth/invite", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = await parseJson<{
    user?: MeResponse;
    next?: string;
    message?: string;
    error?: string;
  }>(res);
  if (!res.ok) {
    throw new Error(data.message || data.error || "invite_failed");
  }
  return { user: data.user!, next: data.next || "/app" };
}

export async function updateProfile(input: {
  displayName: string;
  whatsapp: string;
  districtId: string;
}): Promise<MeResponse> {
  const res = await fetch("/api/me/profile", {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await parseJson<MeResponse & { message?: string }>(res);
  if (!res.ok) {
    throw new Error(data.message || "profile_failed");
  }
  return data;
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch("/api/me", { method: "DELETE", credentials: "include" });
  if (!res.ok) {
    throw new Error("delete_failed");
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
}

export async function fetchDistricts(): Promise<{ id: string; name: string }[]> {
  const res = await fetch("/api/districts", { credentials: "include" });
  if (!res.ok) {
    throw new Error("districts_failed");
  }
  const data = await parseJson<{ districts: { id: string; name: string }[] }>(res);
  return data.districts;
}

export async function fetchHealth(): Promise<{
  ok: boolean;
  slice: string;
  googleConfigured?: boolean;
}> {
  const res = await fetch("/api/health");
  if (!res.ok) {
    throw new Error("health_failed");
  }
  return parseJson(res);
}

export async function fetchSeedStats(): Promise<{
  seeded: boolean;
  counts: {
    districts: number;
    users: number;
    posts: number;
    responses: number;
  } | null;
}> {
  const res = await fetch("/api/seed-stats", { credentials: "include" });
  if (!res.ok) {
    throw new Error("seed_stats_failed");
  }
  return parseJson(res);
}

export function googleAuthHref(): string {
  return "/api/auth/google";
}
