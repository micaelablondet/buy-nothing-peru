import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import {
  fetchAuthConfig,
  fetchMe,
  goAfterAuth,
  googleAuthHref,
  setAuthReturnPath,
  startStubSession,
  type AuthConfig,
} from "@/lib/api";

function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return null;
  }
  if (raw.startsWith("/p/") || raw === "/app" || raw.startsWith("/app/")) {
    return raw;
  }
  return null;
}

export function EntrarPage() {
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [returnReady, setReturnReady] = useState(!next);

  useEffect(() => {
    const oauthError = params.get("error");
    if (oauthError) {
      setError(copy.entrar.oauthError);
    }
    fetchMe()
      .then((me) => setHasSession(Boolean(me)))
      .catch(() => setHasSession(false));
    fetchAuthConfig()
      .then(setConfig)
      .catch(() =>
        setConfig({
          googleConfigured: false,
          inviteRequired: true,
          stubAuth: false,
        }),
      );
  }, [params]);

  useEffect(() => {
    if (!next) {
      setReturnReady(true);
      return;
    }
    void setAuthReturnPath(next)
      .catch(() => undefined)
      .finally(() => setReturnReady(true));
  }, [next]);

  useEffect(() => {
    if (hasSession && returnReady) {
      goAfterAuth(next ?? "/app");
    }
  }, [hasSession, returnReady, next]);

  if (hasSession) {
    return <div className="shell-loading">…</div>;
  }

  const onStub = async () => {
    setBusy(true);
    setError(null);
    try {
      if (next) {
        await setAuthReturnPath(next);
      }
      const result = await startStubSession();
      goAfterAuth(result.next || next || "/app");
    } catch {
      setError(copy.errors.session);
      setBusy(false);
    }
  };

  return (
    <div className="entrar">
      <p className="entrar__eyebrow">{copy.appName}</p>
      <h1 className="entrar__title">{copy.entrar.title}</h1>
      <p className="entrar__body">{copy.entrar.body}</p>

      {config?.googleConfigured ? (
        <a className="btn-primary" href={googleAuthHref(next)}>
          {copy.entrar.ctaGoogle}
        </a>
      ) : (
        <p className="entrar__note">{copy.entrar.googleMissing}</p>
      )}

      {config?.stubAuth ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={busy || !returnReady}
          onClick={() => void onStub()}
        >
          {copy.entrar.ctaStub}
        </button>
      ) : null}

      <p className="entrar__note">{copy.entrar.note}</p>
      <p className="entrar__legal">
        <Link to="/legal/terminos">{copy.entrar.terms}</Link>
        {" · "}
        <Link to="/legal/privacidad">{copy.entrar.privacy}</Link>
      </p>
      {error ? <p className="entrar__error">{error}</p> : null}
    </div>
  );
}
