import { findPostById } from "../db/posts";
import {
  insertNotification,
  type NotificationType,
} from "../db/notifications";
import type { WorkerEnv } from "../env";
import { NOTIFICATION_TITLES } from "./notificationTitles";
import { sendPushToUser } from "./push";

export { NOTIFICATION_TITLES };
export type { NotificationType };

/** Insert inbox notification (source of truth), then fan-out push. */
export async function notifyUser(
  env: WorkerEnv,
  input: {
    userId: string;
    type: NotificationType;
    postId: string;
    nowIso: string;
  },
  opts?: { waitUntil?: (promise: Promise<unknown>) => void },
): Promise<void> {
  await insertNotification(env.DB, {
    id: crypto.randomUUID(),
    userId: input.userId,
    type: input.type,
    postId: input.postId,
    nowIso: input.nowIso,
  });

  const post = await findPostById(env.DB, input.postId).catch(() => null);
  const postTitle = post?.title ?? "";

  const pushTask = sendPushToUser(env, input.userId, {
    type: input.type,
    postId: input.postId,
    postTitle,
  });

  if (opts?.waitUntil) {
    opts.waitUntil(pushTask);
  } else {
    await pushTask;
  }
}
