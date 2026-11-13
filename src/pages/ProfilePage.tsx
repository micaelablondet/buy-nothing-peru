import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { deleteAccount, fetchDistricts, updateProfile } from "@/lib/api";

export function ProfilePage() {
  const { me, refreshMe } = useOutletContext<SessionOutletContext>();
  const navigate = useNavigate();
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [displayName, setDisplayName] = useState(me.displayName);
  const [whatsapp, setWhatsapp] = useState(
    me.whatsapp?.replace(/^\+51/, "") ?? "",
  );
  const [districtId, setDistrictId] = useState(me.districtId ?? "dist-barranco");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDistricts()
      .then(setDistricts)
      .catch(() => setDistricts([{ id: "dist-barranco", name: "Barranco" }]));
  }, []);

  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({ displayName, whatsapp, districtId });
      await refreshMe();
      setMessage(copy.profile.saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.session);
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm(copy.profile.deleteConfirm)) {
      return;
    }
    setBusy(true);
    try {
      await deleteAccount();
      navigate("/entrar", { replace: true });
    } catch {
      setError(copy.errors.session);
      setBusy(false);
    }
  };

  return (
    <section className="empty-panel">
      <h1 className="empty-panel__title">{copy.profile.title}</h1>
      <Link className="btn-secondary" to="/app/mis-publicaciones">
        {copy.profile.myPosts}
      </Link>
      {me.isAdmin ? (
        <Link className="btn-secondary" to="/admin">
          {copy.admin.link}
        </Link>
      ) : null}
      <form className="form-stack" onSubmit={(e) => void onSave(e)}>
        <label className="field">
          <span className="field__label">{copy.onboarding.name}</span>
          <input
            className="field__input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.onboarding.whatsapp}</span>
          <input
            className="field__input"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            inputMode="tel"
            required
          />
        </label>
        <label className="field">
          <span className="field__label">{copy.onboarding.district}</span>
          <select
            className="field__input"
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-primary" disabled={busy}>
          {copy.profile.edit}
        </button>
      </form>
      {message ? <p className="empty-panel__meta">{message}</p> : null}
      {error ? <p className="entrar__error">{error}</p> : null}
      <button
        type="button"
        className="btn-danger"
        disabled={busy}
        onClick={() => void onDelete()}
      >
        {copy.profile.delete}
      </button>
    </section>
  );
}
