import { insertNotification, type NotificationType } from "../db/notifications";
import type { WorkerEnv } from "../env";

export const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  nuevo_interesado: "Nuevo interesado",
  nueva_oferta: "Nueva oferta",
  te_eligieron: "Te eligieron",
  recordatorio: "Recordatorio",
};

/** Insert inbox notification. Push fan-out uses stored subscriptions when configured. */
export async function notifyUser(
  env: WorkerEnv,
  input: {
    userId: string;
    type: NotificationType;
    postId: string;
    nowIso: string;
  },
): Promise<void> {
  await insertNotification(env.DB, {
    id: crypto.randomUUID(),
    userId: input.userId,
    type: input.type,
    postId: input.postId,
    nowIso: input.nowIso,
  });
  // Push payload encryption is deferred; subscriptions are stored (NOTIF-02).
  // Inbox remains the source of truth (NOTIF-01 / R-06).
  void env;
}
