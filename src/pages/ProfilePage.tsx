import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import {
  deleteAccount,
  fetchDistricts,
  fetchPushConfig,
  savePushSubscription,
  updateProfile,
} from "@/lib/api";
import {
  getExistingPushSubscription,
  isPushSupported,
  subscribeToPush,
} from "@/lib/push";

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
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushBlocked, setPushBlocked] = useState(false);

  useEffect(() => {
    fetchDistricts()
      .then(setDistricts)
      .catch(() => setDistricts([{ id: "dist-barranco", name: "Barranco" }]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadPush = async () => {
      if (!isPushSupported()) {
        return;
      }
      try {
        const config = await fetchPushConfig();
        if (cancelled) return;
        setVapidKey(config.vapidPublicKey);
        if (Notification.permission === "denied") {
          setPushBlocked(true);
        }
        const sub = await getExistingPushSubscription();
        if (cancelled) return;
        setPushEnabled(Boolean(sub) && Notification.permission === "granted");
      } catch {
        // Optional row.
      }
    };
    void loadPush();
    return () => {
      cancelled = true;
    };
  }, []);
  const onSave = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await updateProfile({
        displayName,
        whatsapp,
        districtId,
      });
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

      {vapidKey && isPushSupported() ? (
        <div className="profile-push">
          <p className="profile-push__label">{copy.push.profileLabel}</p>
          {pushEnabled ? (
            <p className="profile-push__status">{copy.push.enabled}</p>
          ) : (
            <>
              {pushBlocked ? (
                <p className="profile-push__status">{copy.push.blocked}</p>
              ) : (
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={pushBusy}
                  onClick={() => {
                    void (async () => {
                      setPushBusy(true);
                      setPushBlocked(false);
                      try {
                        const sub = await subscribeToPush(vapidKey);
                        if (
                          !sub?.endpoint ||
                          !sub.keys?.p256dh ||
                          !sub.keys?.auth
                        ) {
                          if (Notification.permission === "denied") {
                            setPushBlocked(true);
                          }
                          return;
                        }
                        await savePushSubscription({
                          endpoint: sub.endpoint,
                          keys: {
                            p256dh: sub.keys.p256dh,
                            auth: sub.keys.auth,
                          },
                        });
                        setPushEnabled(true);
                      } finally {
                        setPushBusy(false);
                      }
                    })();
                  }}
                >
                  {copy.push.cta}
                </button>
              )}
            </>
          )}
        </div>
      ) : null}

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
