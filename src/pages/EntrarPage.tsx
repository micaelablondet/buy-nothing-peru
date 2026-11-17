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
import { stashInviteCodigo } from "@/lib/inviteCodigo";
import { sanitizeReturnPath } from "@/lib/returnPath";
import "@/styles/landing.css";

export function EntrarPage() {
  const [params] = useSearchParams();
  const next = sanitizeReturnPath(params.get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AuthConfig | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [returnReady, setReturnReady] = useState(!next);

  useEffect(() => {
    // AUTH-05: /entrar?codigo=… → pre-fill invite step later.
    stashInviteCodigo(params.get("codigo"));
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

  const { sections } = copy.entrar;

  return (
    <div className="landing">
      <header className="landing__masthead">
        <p className="landing__brand">{copy.appName}</p>
      </header>

      <div className="landing__hero">
        <div className="landing__art">
          <img
            className="landing__art-img"
            src="/images/landing-hero.jpg"
            alt=""
          />
        </div>

        <div className="landing__copy">
          <p className="landing__kicker">{copy.entrar.kicker}</p>
          <h1 className="landing__title">{copy.entrar.title}</h1>
          <p className="landing__lede">{copy.entrar.lede}</p>

          <div className="landing__auth">
            {config?.googleConfigured ? (
              <>
                <a className="landing__cta" href={googleAuthHref(next)}>
                  {copy.entrar.ctaGoogle}
                </a>
                <a className="landing__cta-signin" href={googleAuthHref(next)}>
                  {copy.entrar.ctaSignIn}
                </a>
              </>
            ) : null}

            {config?.stubAuth ? (
              <button
                type="button"
                className={
                  config.googleConfigured
                    ? "landing__cta landing__cta--ghost"
                    : "landing__cta"
                }
                disabled={busy || !returnReady}
                onClick={() => void onStub()}
              >
                {copy.entrar.ctaStub}
              </button>
            ) : null}

            {!config?.googleConfigured && !config?.stubAuth ? (
              <p className="landing__note">{copy.entrar.googleMissing}</p>
            ) : null}

            {error ? <p className="landing__error">{error}</p> : null}
          </div>
        </div>
      </div>

      <hr className="landing__divider" />

      <div className="landing__sections">
        <section className="landing__section">
          <p className="landing__section-label">{sections.whatLabel}</p>
          <h2 className="landing__section-title">{sections.whatTitle}</h2>
          <p className="landing__section-body">{sections.whatBody}</p>
        </section>
        <section className="landing__section">
          <p className="landing__section-label">{sections.howLabel}</p>
          <h2 className="landing__section-title">{sections.howTitle}</h2>
          <p className="landing__section-body">{sections.howBody}</p>
        </section>
        <section className="landing__section">
          <p className="landing__section-label">{sections.freeLabel}</p>
          <h2 className="landing__section-title">{sections.freeTitle}</h2>
          <p className="landing__section-body">{sections.freeBody}</p>
        </section>
      </div>

      <footer className="landing__foot">
        <p className="landing__foot-mark">{copy.appName}</p>
        <p>
          <Link to="/legal/terminos">{copy.entrar.terms}</Link>
          {" · "}
          <Link to="/legal/privacidad">{copy.entrar.privacy}</Link>
        </p>
      </footer>
    </div>
  );
}
