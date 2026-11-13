import { useEffect, useState } from "react";
import { copy } from "@/copy/es-PE";
import {
  dismissInstallPrompt,
  isInstallDismissed,
  isStandalone,
} from "@/lib/install";

/** R-06: prompt Añadir a inicio after first post/response (not on first load). */
export function InstallPrompt({ armed }: { armed: boolean }) {
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<{
    prompt: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (!armed || isStandalone() || isInstallDismissed()) {
      return;
    }
    setVisible(true);
  }, [armed]);

  useEffect(() => {
    const onBip = (event: Event) => {
      event.preventDefault();
      const e = event as Event & { prompt: () => Promise<void> };
      setDeferred({ prompt: () => e.prompt() });
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  if (!visible) {
    return null;
  }

  const dismiss = () => {
    dismissInstallPrompt();
    setVisible(false);
  };

  return (
    <div className="install-prompt" role="status">
      <p className="install-prompt__body">{copy.install.body}</p>
      {deferred ? (
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            void deferred.prompt().finally(dismiss);
          }}
        >
          {copy.install.cta}
        </button>
      ) : (
        <p className="install-prompt__hint">{copy.install.iosHint}</p>
      )}
      <button type="button" className="btn-text" onClick={dismiss}>
        {copy.install.dismiss}
      </button>
    </div>
  );
}
