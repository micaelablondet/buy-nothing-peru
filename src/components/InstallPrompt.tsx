import { useEffect, useState } from "react";
import { copy } from "@/copy/es-PE";
import { fetchPushConfig, savePushSubscription } from "@/lib/api";
import {
  dismissInstallPrompt,
  INSTALL_OFFER_EVENT,
  isInstallDismissed,
  isInstallPromptArmed,
  isStandalone,
} from "@/lib/install";
import {
  clearPushOfferArmed,
  isIosDevice,
  isPushOfferArmed,
  isPushSupported,
  markPushOffered,
  PUSH_OFFER_EVENT,
  shouldOfferPush,
  subscribeToPush,
} from "@/lib/push";

type Mode = "hidden" | "push" | "install";

/**
 * Soft-ask for push (NOTIF-02 / DEC-33) and/or Añadir a inicio (R-06).
 * Permission is only requested from the Activar avisos tap.
 */
export function InstallPrompt({ armed }: { armed: boolean }) {
  const [mode, setMode] = useState<Mode>("hidden");
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [deferred, setDeferred] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    const onBip = (event: Event) => {
      event.preventDefault();
      const e = event as Event & { prompt: () => Promise<void> };
      setDeferred({ prompt: () => e.prompt() });
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const pushArmed = isPushOfferArmed() || armed;
      const installArmed = isInstallPromptArmed() || armed;

      if (pushArmed && isIosDevice() && !isStandalone()) {
        if (!isInstallDismissed()) {
          if (!cancelled) setMode("install");
        } else if (!cancelled) {
          setMode("hidden");
        }
        return;
      }

      if (pushArmed && isPushSupported() && shouldOfferPush()) {
        try {
          const config = await fetchPushConfig();
          if (cancelled) return;
          if (config.vapidPublicKey) {
            setVapidKey(config.vapidPublicKey);
            setMode("push");
            return;
          }
        } catch {
          // Fall through to install.
        }
      }

      if (
        installArmed &&
        !isStandalone() &&
        !isInstallDismissed()
      ) {
        if (!cancelled) setMode("install");
        return;
      }

      if (!cancelled) setMode("hidden");
    };

    void refresh();
    const onArm = () => {
      void refresh();
    };
    window.addEventListener(PUSH_OFFER_EVENT, onArm);
    window.addEventListener(INSTALL_OFFER_EVENT, onArm);
    return () => {
      cancelled = true;
      window.removeEventListener(PUSH_OFFER_EVENT, onArm);
      window.removeEventListener(INSTALL_OFFER_EVENT, onArm);
    };
  }, [armed]);

  if (mode === "hidden") {
    return null;
  }

  if (mode === "push") {
    const dismiss = () => {
      markPushOffered();
      setMode("hidden");
    };

    const activate = async () => {
      if (!vapidKey || busy) {
        return;
      }
      setBusy(true);
      setBlocked(false);
      try {
        const sub = await subscribeToPush(vapidKey);
        markPushOffered();
        if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
          if (Notification.permission === "denied") {
            setBlocked(true);
            setBusy(false);
            return;
          }
          setMode("hidden");
          return;
        }
        await savePushSubscription({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        });
        setMode("hidden");
      } catch {
        markPushOffered();
        setMode("hidden");
      } finally {
        setBusy(false);
      }
    };

    return (
      <div className="install-prompt" role="status" data-testid="push-soft-ask">
        <p className="install-prompt__title">{copy.push.title}</p>
        <p className="install-prompt__body">{copy.push.body}</p>
        {blocked ? (
          <p className="install-prompt__hint">{copy.push.blocked}</p>
        ) : null}
        <button
          type="button"
          className="btn-primary"
          disabled={busy}
          onClick={() => void activate()}
        >
          {copy.push.cta}
        </button>
        <button type="button" className="btn-text" onClick={dismiss}>
          {copy.push.dismiss}
        </button>
      </div>
    );
  }

  const dismissInstall = () => {
    dismissInstallPrompt();
    clearPushOfferArmed();
    setMode("hidden");
  };

  return (
    <div className="install-prompt" role="status">
      <p className="install-prompt__body">{copy.install.body}</p>
      {deferred ? (
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            void deferred.prompt().finally(dismissInstall);
          }}
        >
          {copy.install.cta}
        </button>
      ) : (
        <p className="install-prompt__hint">{copy.install.iosHint}</p>
      )}
      <button type="button" className="btn-text" onClick={dismissInstall}>
        {copy.install.dismiss}
      </button>
    </div>
  );
}
