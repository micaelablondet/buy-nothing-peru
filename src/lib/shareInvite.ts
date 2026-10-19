import { APP_NAME } from "@/lib/brand";

function pickStoreListingUrl(): string {
  const ios = import.meta.env.VITE_APP_IOS_STORE_URL?.trim();
  const android = import.meta.env.VITE_APP_ANDROID_STORE_URL?.trim();

  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent;
    if (/android/i.test(ua) && android) {
      return android;
    }
    if (/iPhone|iPad|iPod/i.test(ua) && ios) {
      return ios;
    }
  }

  return ios ?? android ?? "";
}

export function buildInviteSharePayload(): { title: string; text: string; url: string } {
  const storeUrl = pickStoreListingUrl();
  const url = storeUrl || window.location.origin;
  const text = storeUrl
    ? `Únete a ${APP_NAME} — regala y pide cosas con vecinos de tu barrio, sin precio. Descarga la app: ${storeUrl}`
    : `Únete a ${APP_NAME} — regala y pide cosas con vecinos de tu barrio, sin precio. ${url}`;

  return {
    title: `Comparte ${APP_NAME}`,
    text,
    url: storeUrl || url,
  };
}

/** Opens the OS share sheet when available; copies message otherwise. */
export async function shareAppInvite(): Promise<"shared" | "copied" | "cancelled"> {
  const payload = buildInviteSharePayload();

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return "cancelled";
      }
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text);
    return "copied";
  }

  window.prompt("Copia este enlace para invitar:", payload.text);
  return "copied";
}
