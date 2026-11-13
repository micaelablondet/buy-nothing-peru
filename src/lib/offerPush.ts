import { fetchPushConfig, savePushSubscription } from "@/lib/api";
import { armInstallPrompt } from "@/lib/install";
import { markPushOffered, shouldOfferPush, subscribeToPush } from "@/lib/push";

/** Call after a successful first post or response (NOTIF-02 + R-06). Silent on failure. */
export async function maybeOfferPushAfterAction(): Promise<void> {
  armInstallPrompt();
  if (!shouldOfferPush()) {
    return;
  }
  markPushOffered();
  try {
    const config = await fetchPushConfig();
    if (!config.vapidPublicKey) {
      return;
    }
    const sub = await subscribeToPush(config.vapidPublicKey);
    if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      return;
    }
    await savePushSubscription({
      endpoint: sub.endpoint,
      keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    });
  } catch {
    // Spec: no error shown if push denied or unsupported.
  }
}
