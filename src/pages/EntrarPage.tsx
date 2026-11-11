import { useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import {
  fetchAuthConfig,
  fetchMe,
  googleAuthHref,
  startStubSession,
  type AuthConfig,
} from "@/lib/api";

export function EntrarPage() {
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

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

  if (hasSession) {
    return <Navigate to="/app" replace />;
  }

  const onStub = async () => {
    setBusy(true);
    setError(null);
    try {
      await startStubSession();
      window.location.href = "/app";
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
        <a className="btn-primary" href={googleAuthHref()}>
          {copy.entrar.ctaGoogle}
        </a>
      ) : (
        <p className="entrar__note">{copy.entrar.googleMissing}</p>
      )}

      {config?.stubAuth ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
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
