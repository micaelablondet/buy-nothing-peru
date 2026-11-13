/** NOTIF-02: offer web push after first post/response — never on first load. */

const OFFERED_KEY = "barrio_push_offered";

export function shouldOfferPush(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }
  if (Notification.permission === "denied") {
    return false;
  }
  return localStorage.getItem(OFFERED_KEY) !== "1";
}

export function markPushOffered(): void {
  localStorage.setItem(OFFERED_KEY, "1");
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
