import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { webcrypto } from "node:crypto";
import type { WorkerEnv } from "../env";
import { runNudgeJob } from "../jobs/nudge";
import { NOTIFICATION_TITLES } from "./notificationTitles";
import { notifyUser } from "./notify";
import { buildPushPayloadJson, sendPushToUser } from "./push";

/** Fresh throwaway VAPID pair per test file — never hard-code key material. */
let PUBLIC_KEY = "";
let PRIVATE_KEY = "";

beforeAll(async () => {
  const pair = await webcrypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const rawPub = new Uint8Array(
    await webcrypto.subtle.exportKey("raw", pair.publicKey),
  );
  const jwk = await webcrypto.subtle.exportKey("jwk", pair.privateKey);
  if (!jwk.d) {
    throw new Error("VAPID private key export missing d");
  }
  PUBLIC_KEY = Buffer.from(rawPub)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  PRIVATE_KEY = jwk.d;
});

function makeEnv(overrides: Partial<WorkerEnv> = {}): WorkerEnv {
  return {
    DB: {} as D1Database,
    PHOTOS: {} as R2Bucket,
    ASSETS: {} as Fetcher,
    APP_NAME: "Barrio",
    INVITE_REQUIRED: "true",
    ENVIRONMENT: "development",
    APP_BASE_URL: "https://barrio.example.test",
    SESSION_SECRET: "test-session-secret-16",
    GOOGLE_CLIENT_ID: "x",
    GOOGLE_CLIENT_SECRET: "y",
    VAPID_PUBLIC_KEY: PUBLIC_KEY,
    VAPID_PRIVATE_KEY: PRIVATE_KEY,
    ...overrides,
  };
}

async function realSubKeys(): Promise<{ p256dh: string; auth: string }> {
  const { webcrypto } = await import("node:crypto");
  const pair = await webcrypto.subtle.generateKey(
    { name: "ECDH", namedCurve: "P-256" },
    true,
    ["deriveBits"],
  );
  const raw = new Uint8Array(
    await webcrypto.subtle.exportKey("raw", pair.publicKey),
  );
  const toB64Url = (bytes: Uint8Array) =>
    Buffer.from(bytes)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  return {
    p256dh: toB64Url(raw),
    auth: toB64Url(webcrypto.getRandomValues(new Uint8Array(16))),
  };
}

describe("sendPushToUser (NOTIF-02/03)", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("no-ops when VAPID keys are missing", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await sendPushToUser(
      makeEnv({ VAPID_PUBLIC_KEY: undefined, VAPID_PRIVATE_KEY: undefined }),
      "user-1",
      { type: "nuevo_interesado", postId: "post-1", postTitle: "Microondas" },
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("POSTs once per subscription with aes128gcm and vapid Authorization", async () => {
    const keys = await realSubKeys();
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const env = makeEnv({
      DB: {
        prepare: vi.fn().mockReturnValue({
          bind: () => ({
            all: async () => ({
              results: [
                {
                  id: "sub-1",
                  user_id: "user-1",
                  endpoint: "https://push.example/endpoint-1",
                  p256dh: keys.p256dh,
                  auth: keys.auth,
                  created_at: "2026-11-18T00:00:00.000Z",
                },
              ],
            }),
          }),
        }),
      } as unknown as D1Database,
    });

    await sendPushToUser(env, "user-1", {
      type: "te_eligieron",
      postId: "post-1",
      postTitle: "Silla",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://push.example/endpoint-1");
    expect(init.method?.toUpperCase()).toBe("POST");
    const headers = new Headers(init.headers);
    expect(headers.get("Content-Encoding")).toBe("aes128gcm");
    expect((headers.get("Authorization") ?? "").toLowerCase()).toContain(
      "vapid",
    );
  });

  it("deletes subscription on 404/410", async () => {
    const keys = await realSubKeys();
    const deleteRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const prepare = vi.fn((sql: string) => {
      if (sql.includes("SELECT")) {
        return {
          bind: () => ({
            all: async () => ({
              results: [
                {
                  id: "sub-1",
                  user_id: "user-1",
                  endpoint: "https://push.example/gone",
                  p256dh: keys.p256dh,
                  auth: keys.auth,
                  created_at: "2026-11-18T00:00:00.000Z",
                },
              ],
            }),
          }),
        };
      }
      return { bind: () => ({ run: deleteRun }) };
    });

    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(null, { status: 410 }),
      ) as unknown as typeof fetch;

    await sendPushToUser(
      makeEnv({ DB: { prepare } as unknown as D1Database }),
      "user-1",
      { type: "nueva_oferta", postId: "post-1", postTitle: "Mesa" },
    );

    expect(deleteRun).toHaveBeenCalled();
  });

  it("payload has only title/body/url with no name, number or email", () => {
    const blob = buildPushPayloadJson({
      type: "nuevo_interesado",
      postId: "post-abc",
      postTitle: "Microondas Samsung",
    });
    const parsed = JSON.parse(blob) as Record<string, string>;
    expect(Object.keys(parsed).sort()).toEqual(["body", "title", "url"]);
    expect(parsed.title).toBe(NOTIFICATION_TITLES.nuevo_interesado);
    expect(parsed.body).toBe("Microondas Samsung");
    expect(parsed.url).toBe("/app/p/post-abc");
    expect(blob).not.toMatch(/\+51/);
    expect(blob).not.toMatch(/@/);
    expect(blob.toLowerCase()).not.toContain("whatsapp");
    expect(blob).not.toMatch(/Mica|Lucia|Carlos/i);
  });
});

describe("notifyUser push + inbox", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inserts inbox even when push fails", async () => {
    const insertRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const prepare = vi.fn((sql: string) => {
      if (sql.includes("INSERT INTO notifications")) {
        return { bind: () => ({ run: insertRun }) };
      }
      if (sql.includes("FROM posts")) {
        return {
          bind: () => ({
            first: async () => ({
              id: "post-1",
              title: "Microondas",
              author_id: "user-a",
            }),
          }),
        };
      }
      if (sql.includes("push_subscriptions")) {
        return {
          bind: () => ({
            all: async () => {
              throw new Error("push list failed");
            },
          }),
        };
      }
      return {
        bind: () => ({
          run: vi.fn(),
          first: async () => null,
          all: async () => ({ results: [] }),
        }),
      };
    });

    await notifyUser(
      makeEnv({
        DB: { prepare } as unknown as D1Database,
      }),
      {
        userId: "user-b",
        type: "nuevo_interesado",
        postId: "post-1",
        nowIso: "2026-11-18T12:00:00.000Z",
      },
    );

    expect(insertRun).toHaveBeenCalled();
  });

  it("schedules push via waitUntil after inbox insert", async () => {
    const insertRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const prepare = vi.fn((sql: string) => {
      if (sql.includes("INSERT INTO notifications")) {
        return { bind: () => ({ run: insertRun }) };
      }
      if (sql.includes("FROM posts")) {
        return {
          bind: () => ({
            first: async () => ({ id: "post-1", title: "Silla" }),
          }),
        };
      }
      return {
        bind: () => ({
          all: async () => ({ results: [] }),
          first: async () => null,
          run: vi.fn(),
        }),
      };
    });

    const waited: Promise<unknown>[] = [];
    await notifyUser(
      makeEnv({ DB: { prepare } as unknown as D1Database }),
      {
        userId: "user-1",
        type: "recordatorio",
        postId: "post-1",
        nowIso: "2026-11-18T12:00:00.000Z",
      },
      { waitUntil: (p) => waited.push(p) },
    );

    expect(insertRun).toHaveBeenCalled();
    expect(waited).toHaveLength(1);
    await waited[0];
  });
});

describe("nudge + push (NOTIF-04)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("nudges once and routes Recordatorio through notifyUser (inbox + push)", async () => {
    const keys = await realSubKeys();
    const insertRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const updateRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    const eventRun = vi.fn().mockResolvedValue({ meta: { changes: 1 } });
    let candidateCalls = 0;

    const prepare = vi.fn((sql: string) => {
      if (sql.includes("MIN(r.created_at)")) {
        candidateCalls += 1;
        return {
          all: async () => ({
            results:
              candidateCalls === 1
                ? [
                    {
                      id: "post-nudge",
                      author_id: "user-1",
                      status: "open",
                      nudge_sent_at: null,
                      first_response_at: "2026-11-01T00:00:00.000Z",
                    },
                  ]
                : [],
          }),
        };
      }
      if (sql.includes("FROM notifications") && sql.includes("recordatorio")) {
        return { bind: () => ({ first: async () => null }) };
      }
      if (sql.includes("UPDATE posts SET nudge_sent_at")) {
        return { bind: () => ({ run: updateRun }) };
      }
      if (sql.includes("INSERT INTO notifications")) {
        return { bind: () => ({ run: insertRun }) };
      }
      if (sql.includes("FROM posts") && sql.includes("WHERE id")) {
        return {
          bind: () => ({
            first: async () => ({
              id: "post-nudge",
              title: "Lámpara",
              author_id: "user-1",
            }),
          }),
        };
      }
      if (sql.includes("push_subscriptions")) {
        return {
          bind: () => ({
            all: async () => ({
              results: [
                {
                  id: "sub-1",
                  user_id: "user-1",
                  endpoint: "https://push.example/nudge",
                  p256dh: keys.p256dh,
                  auth: keys.auth,
                  created_at: "2026-11-18T00:00:00.000Z",
                },
              ],
            }),
          }),
        };
      }
      if (sql.includes("INSERT INTO events") || sql.includes("events")) {
        return { bind: () => ({ run: eventRun }) };
      }
      return {
        bind: () => ({
          run: vi.fn(),
          first: async () => null,
          all: async () => ({ results: [] }),
        }),
        all: async () => ({ results: [] }),
      };
    });

    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 201 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const env = makeEnv({ DB: { prepare } as unknown as D1Database });
    const first = await runNudgeJob(env, "2026-11-03T00:00:00.000Z");
    expect(first.nudged).toBe(1);
    expect(insertRun).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Same post already has nudge_sent_at path — second run finds no candidates.
    const second = await runNudgeJob(env, "2026-11-04T00:00:00.000Z");
    expect(second.nudged).toBe(0);
    expect(insertRun).toHaveBeenCalledTimes(1);
  });
});
