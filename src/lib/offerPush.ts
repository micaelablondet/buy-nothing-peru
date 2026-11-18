import { armInstallPrompt } from "@/lib/install";
import { armPushOffer } from "@/lib/push";

/**
 * After a successful first post or response (NOTIF-02 + R-06).
 * Arms soft-ask / install UI only — never requests permission here (must be a tap).
 */
export function maybeOfferPushAfterAction(): void {
  armInstallPrompt();
  armPushOffer();
}
