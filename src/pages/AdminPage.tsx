import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import {
  adminRemovePost,
  createAdminInvite,
  fetchAdminInvites,
  fetchAdminMetrics,
  fetchAdminPosts,
  fetchAdminReports,
  setAdminInviteActive,
  type AdminMetrics,
} from "@/lib/api";

export function AdminPage() {
  const { me } = useOutletContext<SessionOutletContext>();
  const [tab, setTab] = useState<"reports" | "posts" | "invites" | "metrics">(
    "reports",
  );
  const [reports, setReports] = useState<
    Awaited<ReturnType<typeof fetchAdminReports>>
  >([]);
  const [posts, setPosts] = useState<
    Awaited<ReturnType<typeof fetchAdminPosts>>
  >([]);
  const [invites, setInvites] = useState<
    Awaited<ReturnType<typeof fetchAdminInvites>>
  >([]);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [newCode, setNewCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    setError(null);
    try {
      if (tab === "reports") {
        setReports(await fetchAdminReports());
      } else if (tab === "posts") {
        setPosts(await fetchAdminPosts());
      } else if (tab === "invites") {
        setInvites(await fetchAdminInvites());
      } else {
        setMetrics(await fetchAdminMetrics());
      }
    } catch {
      setError(copy.errors.forbidden);
    }
  };

  useEffect(() => {
    void reload();
  }, [tab]);

  if (!me.isAdmin) {
    return <Navigate to="/app" replace />;
  }

  const onRemove = async (id: string) => {
    if (!window.confirm(copy.admin.removeConfirm)) {
      return;
    }
    setBusy(true);
    try {
      await adminRemovePost(id);
      await reload();
    } catch {
      setError(copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  const onCreateInvite = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await createAdminInvite(newCode);
      setNewCode("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="admin">
      <Link to="/app" className="legal__back">
        ← {copy.legal.back}
      </Link>
      <h1 className="publish__title">{copy.admin.title}</h1>
      <div className="admin__tabs">
        {(
          [
            ["reports", copy.admin.reports],
            ["posts", copy.admin.posts],
            ["invites", copy.admin.invites],
            ["metrics", copy.admin.metrics],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={tab === key ? "btn-primary" : "btn-secondary"}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>
      {error ? <p className="entrar__error">{error}</p> : null}

      {tab === "reports" ? (
        <ul className="feed__list">
          {reports.length === 0 ? (
            <p className="feed__empty">{copy.admin.emptyReports}</p>
          ) : null}
          {reports.map((r) => (
            <li key={r.id} className="response-card">
              <h2 className="feed-card__title">{r.postTitle}</h2>
              <p className="feed-card__meta">
                {r.reason} · {r.reporterName}
              </p>
              {r.text ? <p>{r.text}</p> : null}
              <Link className="btn-secondary" to={`/app/p/${r.postId}`}>
                {copy.admin.viewPost}
              </Link>
              <button
                type="button"
                className="btn-danger"
                disabled={busy}
                onClick={() => void onRemove(r.postId)}
              >
                {copy.admin.remove}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "posts" ? (
        <ul className="feed__list">
          {posts.map((p) => (
            <li key={p.id} className="response-card">
              <h2 className="feed-card__title">{p.title}</h2>
              <p className="feed-card__meta">
                {p.status} · {p.authorName} · {p.districtName}
              </p>
              {p.status !== "removed" ? (
                <button
                  type="button"
                  className="btn-danger"
                  disabled={busy}
                  onClick={() => void onRemove(p.id)}
                >
                  {copy.admin.remove}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "invites" ? (
        <div className="form-stack">
          <form className="form-stack" onSubmit={(e) => void onCreateInvite(e)}>
            <label className="field">
              <span className="field__label">{copy.admin.newInvite}</span>
              <input
                className="field__input"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="btn-primary" disabled={busy}>
              {copy.admin.newInvite}
            </button>
          </form>
          <ul className="feed__list">
            {invites.map((i) => (
              <li key={i.id} className="response-card">
                <h2 className="feed-card__title">{i.code}</h2>
                <p className="feed-card__meta">
                  {i.active ? copy.admin.active : copy.admin.inactive}
                </p>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={busy}
                  onClick={() =>
                    void setAdminInviteActive(i.id, !i.active).then(reload)
                  }
                >
                  {i.active ? copy.admin.deactivate : copy.admin.activate}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "metrics" && metrics ? (
        <dl className="admin__metrics">
          <div>
            <dt>{copy.admin.accounts}</dt>
            <dd>{metrics.accounts}</dd>
          </div>
          <div>
            <dt>{copy.admin.chWeek}</dt>
            <dd>{metrics.completedHandoffsThisWeek}</dd>
          </div>
          <div>
            <dt>{copy.admin.responseRate}</dt>
            <dd>
              {metrics.responseRate48h == null
                ? "—"
                : `${Math.round(metrics.responseRate48h * 100)}%`}
            </dd>
          </div>
          <div>
            <dt>{copy.admin.medianPost}</dt>
            <dd>
              {metrics.medianPostFormMs == null
                ? "—"
                : `${Math.round(metrics.medianPostFormMs / 1000)}s`}
            </dd>
          </div>
          <div>
            <dt>{copy.admin.inflation}</dt>
            <dd>
              {metrics.inflationCheck == null
                ? "—"
                : `${Math.round(metrics.inflationCheck * 100)}%`}
            </dd>
          </div>
          <div>
            <dt>{copy.admin.discBreakdown}</dt>
            <dd>
              {Object.keys(metrics.discAnswers).length === 0
                ? "—"
                : Object.entries(metrics.discAnswers)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ")}
            </dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
