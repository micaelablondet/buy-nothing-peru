/** NOTIF-02/03 — send Web Push (DEC-33). Never throws; never logs PII. */

import { buildPushPayload } from "@block65/webcrypto-web-push";
import type { NotificationType } from "../db/notifications";
import { deletePushByEndpoint, listPushForUser } from "../db/push";
import type { WorkerEnv } from "../env";
import { NOTIFICATION_TITLES } from "./notificationTitles";

export type PushPayloadInput = {
  type: NotificationType;
  postId: string;
  postTitle: string;
};

/** Plain JSON for SW showNotification — only title, body, url (no PII). */
export function buildPushPayloadJson(input: PushPayloadInput): string {
  return JSON.stringify({
    title: NOTIFICATION_TITLES[input.type],
    body: input.postTitle,
    url: `/app/p/${input.postId}`,
  });
}

function vapidConfigured(env: WorkerEnv): boolean {
  return Boolean(
    env.VAPID_PUBLIC_KEY?.trim() && env.VAPID_PRIVATE_KEY?.trim(),
  );
}

/** Fan-out encrypted push to all stored subscriptions for the user. */
export async function sendPushToUser(
  env: WorkerEnv,
  userId: string,
  input: PushPayloadInput,
): Promise<void> {
  if (!vapidConfigured(env)) {
    return;
  }

  const payloadJson = buildPushPayloadJson(input);

  let subscriptions;
  try {
    subscriptions = await listPushForUser(env.DB, userId);
  } catch {
    return;
  }

  const subject = env.APP_BASE_URL;
  const publicKey = env.VAPID_PUBLIC_KEY!;
  const privateKey = env.VAPID_PRIVATE_KEY!;

  for (const row of subscriptions) {
    try {
      const requestInit = await buildPushPayload(
        {
          data: payloadJson,
          options: { ttl: 86_400 },
        },
        {
          endpoint: row.endpoint,
          expirationTime: null,
          keys: { p256dh: row.p256dh, auth: row.auth },
        },
        { subject, publicKey, privateKey },
      );
      const res = await fetch(row.endpoint, requestInit);
      if (res.status === 404 || res.status === 410) {
        await deletePushByEndpoint(env.DB, row.endpoint).catch(() => undefined);
      }
    } catch {
      // Never throw; skip this subscription.
    }
  }
}
