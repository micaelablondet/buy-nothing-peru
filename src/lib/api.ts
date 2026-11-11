export type MeResponse = {
  id: string;
  firstName: string;
  districtId: string | null;
  isAdmin: boolean;
};

async function parseJson<T>(res: Response): Promise<T> {
  return (await res.json()) as T;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: "mica" }),
  });
  if (!res.ok) {
    throw new Error("session_failed");
  }
  const data = await parseJson<{ user: MeResponse }>(res);
  return data.user;
}

export async function logoutStubSession(): Promise<void> {
  await fetch("/api/dev/logout", { method: "POST", credentials: "include" });
}

export async function fetchHealth(): Promise<{ ok: boolean; slice: string }> {
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
