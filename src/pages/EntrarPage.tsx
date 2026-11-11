import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import { fetchMe, startStubSession } from "@/lib/api";

export function EntrarPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState<boolean | null>(null);

  useEffect(() => {
    fetchMe()
      .then((me) => setHasSession(Boolean(me)))
      .catch(() => setHasSession(false));
  }, []);

  if (hasSession) {
    return <Navigate to="/app" replace />;
  }

  const onContinue = async () => {
    setBusy(true);
    setError(null);
    try {
      await startStubSession();
      navigate("/app", { replace: true });
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
      <button
        type="button"
        className="btn-primary"
        disabled={busy || hasSession === null}
        onClick={() => void onContinue()}
      >
        {copy.entrar.cta}
      </button>
      <p className="entrar__note">{copy.entrar.note}</p>
      {error ? <p className="entrar__error">{error}</p> : null}
    </div>
  );
}
