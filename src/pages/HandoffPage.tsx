import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import {
  fetchHandoff,
  markDelivered,
  markReceived,
  type HandoffPayload,
} from "@/lib/api";

export function HandoffPage() {
  const { id = "" } = useParams();
  const [data, setData] = useState<HandoffPayload | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = () =>
    fetchHandoff(id)
      .then(setData)
      .catch(() => {
        setData(null);
        setError(copy.errors.forbidden);
      });

  useEffect(() => {
    void reload();
  }, [id]);

  if (data === undefined) {
    return <div className="shell-loading">…</div>;
  }
  if (!data) {
    return (
      <section className="empty-panel">
        <p className="entrar__error">{error ?? copy.errors.forbidden}</p>
        <Link to={`/app/p/${id}`}>{copy.post.back}</Link>
      </section>
    );
  }

  const onDelivered = async () => {
    setBusy(true);
    try {
      await markDelivered(id);
      await reload();
    } catch {
      setError(copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  const onReceived = async () => {
    setBusy(true);
    try {
      await markReceived(id);
      await reload();
    } catch {
      setError(copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="handoff">
      <Link to={`/app/p/${id}`} className="legal__back">
        ← {copy.post.back}
      </Link>
      <h1 className="publish__title">{copy.handoff.title}</h1>
      <p className="handoff__with">
        {copy.handoff.with.replace("{name}", data.otherParty.name)}
      </p>
      <p className="handoff__title">{data.title}</p>
      <p className="handoff__tip">{copy.handoff.tip}</p>
      <a className="btn-primary" href={data.waUrl} target="_blank" rel="noreferrer">
        {copy.handoff.writeWhatsApp}
      </a>
      {data.canMarkDelivered ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() => void onDelivered()}
        >
          {copy.handoff.delivered}
        </button>
      ) : null}
      {data.canMarkReceived ? (
        <button
          type="button"
          className="btn-secondary"
          disabled={busy}
          onClick={() => void onReceived()}
        >
          {copy.handoff.received}
        </button>
      ) : null}
      {data.receivedConfirmed ? (
        <p className="feed__meta">{copy.handoff.receivedDone}</p>
      ) : null}
      {error ? <p className="entrar__error">{error}</p> : null}
    </section>
  );
}
