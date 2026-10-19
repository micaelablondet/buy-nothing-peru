export type SubscriptionPlan = "anual" | "mensual";

export const subscriptionPlans: Record<
  SubscriptionPlan,
  { label: string; price: string; detail: string }
> = {
  anual: {
    label: "Anual",
    price: "S/ 179.90",
    detail: "/año",
  },
  mensual: {
    label: "Mensual",
    price: "S/ 17.90",
    detail: "/mes",
  },
};

declare global {
  interface Window {
    /** Injected by the native iOS/Android shell (StoreKit / Play Billing). */
    BarrioNative?: {
      purchaseSubscription?: (
        plan: SubscriptionPlan,
      ) => Promise<"success" | "cancelled">;
    };
  }
}

function nativePlatformHint(): string {
  if (typeof navigator === "undefined") {
    return "iOS o Android";
  }
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return "iOS (App Store / Face ID)";
  }
  if (/Android/i.test(ua)) {
    return "Android (Google Play)";
  }
  return "iOS o Android";
}

/**
 * Opens native IAP when wrapped in the app; browser prototype uses a confirm sheet.
 */
export async function requestNativeSubscription(
  plan: SubscriptionPlan,
): Promise<"success" | "cancelled" | "unavailable"> {
  const native = typeof window !== "undefined" ? window.BarrioNative : undefined;
  if (native?.purchaseSubscription) {
    try {
      return await native.purchaseSubscription(plan);
    } catch {
      return "cancelled";
    }
  }

  const { label, price, detail } = subscriptionPlans[plan];
  const message = `${label} — ${price}${detail}`;
  const platform = nativePlatformHint();

  if (typeof window !== "undefined" && window.confirm) {
    const ok = window.confirm(
      `Pago nativo (${platform})\n\n${message}\n\nEn la app móvil esto abre la hoja de pago de la tienda. ¿Continuar? (simulación en navegador)`,
    );
    return ok ? "success" : "cancelled";
  }

  return "unavailable";
}
