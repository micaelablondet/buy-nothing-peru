/** NOTIF-02: soft-ask web push after first post/response — never on first load. */

const OFFERED_KEY = "barrio_push_offered";
const ARMED_KEY = "barrio_push_armed";
export const PUSH_OFFER_EVENT = "barrio:push-offer";

export function isPushSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return "serviceWorker" in navigator && "PushManager" in window;
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function shouldOfferPush(): boolean {
  if (!isPushSupported()) {
    return false;
  }
  if (Notification.permission === "denied") {
    return false;
  }
  if (Notification.permission === "granted") {
    return false;
  }
  return localStorage.getItem(OFFERED_KEY) !== "1";
}

export function armPushOffer(): void {
  sessionStorage.setItem(ARMED_KEY, "1");
  window.dispatchEvent(new Event(PUSH_OFFER_EVENT));
}

export function isPushOfferArmed(): boolean {
  return sessionStorage.getItem(ARMED_KEY) === "1";
}

export function clearPushOfferArmed(): void {
  sessionStorage.removeItem(ARMED_KEY);
}

export function markPushOffered(): void {
  localStorage.setItem(OFFERED_KEY, "1");
  clearPushOfferArmed();
}

export function isPushOffered(): boolean {
  return localStorage.getItem(OFFERED_KEY) === "1";
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) {
    return null;
  }
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

/** Must be called from a user gesture (tap). */
export async function subscribeToPush(
  vapidPublicKey: string,
): Promise<PushSubscriptionJSON | null> {
  try {
    const reg = await registerServiceWorker();
    if (!reg) {
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    return sub.toJSON();
  } catch {
    return null;
  }
}

export async function getExistingPushSubscription(): Promise<PushSubscription | null> {
  try {
    const reg = await registerServiceWorker();
    if (!reg) {
      return null;
    }
    return (await reg.pushManager.getSubscription()) ?? null;
  } catch {
    return null;
  }
}
