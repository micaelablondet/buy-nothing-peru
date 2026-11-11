import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import {
  fetchDistricts,
  fetchMe,
  updateProfile,
  type MeResponse,
} from "@/lib/api";

export function OnboardingProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState<MeResponse | null | undefined>(undefined);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [districtId, setDistrictId] = useState("dist-barranco");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMe()
      .then((user) => {
        setMe(user);
        if (user) {
          setDisplayName(user.displayName);
          setWhatsapp(user.whatsapp?.replace(/^\+51/, "") ?? "");
          setDistrictId(user.districtId ?? "dist-barranco");
        }
      })
      .catch(() => setMe(null));
    fetchDistricts()
      .then(setDistricts)
      .catch(() => setDistricts([{ id: "dist-barranco", name: "Barranco" }]));
  }, []);

  if (me === undefined) {
    return <div className="shell-loading">…</div>;
  }
  if (!me) {
    return <Navigate to="/entrar" replace />;
  }
  if (me.profileComplete) {
    return <Navigate to="/app" replace />;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await updateProfile({ displayName, whatsapp, districtId });
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname;
      const next =
        from && from !== "/onboarding/perfil" && !from.startsWith("/entrar")
          ? from
          : "/app";
      navigate(next, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.session);
      setBusy(false);
    }
  };

  return (
    <div className="entrar">
      <p className="entrar__eyebrow">{copy.appName}</p>
      <h1 className="entrar__title">{copy.onboarding.title}</h1>
      <p className="entrar__body">{copy.onboarding.body}</p>
      <form className="form-stack" onSubmit={(e) => void onSubmit(e)}>
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
            placeholder={copy.onboarding.whatsappPlaceholder}
            required
          />
          <span className="field__hint">{copy.onboarding.whatsappHint}</span>
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
          {copy.onboarding.cta}
        </button>
      </form>
      {error ? <p className="entrar__error">{error}</p> : null}
    </div>
  );
}
