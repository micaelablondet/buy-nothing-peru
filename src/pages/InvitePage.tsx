import { useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import { goAfterAuth, submitInviteCode } from "@/lib/api";
import { readStashedInviteCodigo } from "@/lib/inviteCodigo";

function initialInviteCode(paramCode: string | null): string {
  const fromQuery = paramCode?.trim() ?? "";
  if (fromQuery) {
    return fromQuery;
  }
  return readStashedInviteCodigo();
}

export function InvitePage() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(() => initialInviteCode(params.get("codigo")));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await submitInviteCode(code);
      goAfterAuth(result.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.invite.invalid);
      setBusy(false);
    }
  };

  return (
    <div className="entrar">
      <p className="entrar__eyebrow">{copy.appName}</p>
      <h1 className="entrar__title">{copy.invite.title}</h1>
      <p className="entrar__body">{copy.invite.body}</p>
      <form className="form-stack" onSubmit={(e) => void onSubmit(e)}>
        <label className="field">
          <span className="field__label">{copy.invite.codeLabel}</span>
          <input
            className="field__input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={copy.invite.placeholder}
            autoComplete="one-time-code"
            required
          />
        </label>
        <button type="submit" className="btn-primary" disabled={busy}>
          {copy.invite.cta}
        </button>
      </form>
      {error ? <p className="entrar__error">{error}</p> : null}
    </div>
  );
}
