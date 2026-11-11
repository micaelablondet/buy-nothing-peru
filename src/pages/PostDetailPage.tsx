import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { formatPostAge } from "@/lib/formatAge";
import { fetchPost, withdrawPost, type PostSummary } from "@/lib/api";

export function PostDetailPage() {
  const { id = "" } = useParams();
  const { me } = useOutletContext<SessionOutletContext>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostSummary | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch(() => {
        setPost(null);
        setError(copy.errors.notFound);
      });
  }, [id]);

  if (post === undefined) {
    return <div className="shell-loading">…</div>;
  }
  if (!post) {
    return (
      <section className="empty-panel">
        <p className="entrar__error">{error ?? copy.errors.notFound}</p>
        <Link to="/app">{copy.post.back}</Link>
      </section>
    );
  }

  const statusLabel =
    copy.post.status[post.status as keyof typeof copy.post.status] ??
    post.status;

  const onWithdraw = async () => {
    if (!window.confirm(copy.post.withdrawConfirm)) {
      return;
    }
    setBusy(true);
    try {
      const updated = await withdrawPost(post.id);
      setPost(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  const onRespond = () => {
    if (!me.whatsapp) {
      navigate("/onboarding/perfil", {
        state: { from: { pathname: `/app/p/${post.id}` } },
      });
      return;
    }
    setNote(copy.post.respondSoon);
  };

  return (
    <article className="post-detail">
      <Link to="/app" className="legal__back">
        ← {copy.post.back}
      </Link>
      {post.photos.length > 0 ? (
        <div className="post-detail__photos">
          {post.photos.map((photo) => (
            <img key={photo.id} src={photo.url} alt="" />
          ))}
        </div>
      ) : null}
      <p className="post-detail__eyebrow">
        {post.type === "regalo" ? copy.publish.regalo : copy.publish.pido} ·{" "}
        {statusLabel}
      </p>
      <h1 className="post-detail__title">{post.title}</h1>
      <p className="post-detail__meta">
        {post.category} · {post.districtName} · {formatPostAge(post.createdAt)}
        <br />
        {copy.feed.by.replace("{name}", post.authorName)}
      </p>
      <p className="post-detail__body">{post.description}</p>

      {post.actions.showOwnerResponses ? (
        <Link
          className="btn-primary"
          to={`/app/p/${post.id}/respuestas`}
        >
          {post.type === "regalo"
            ? copy.post.verInteresados
            : copy.post.verOfertas}
        </Link>
      ) : null}

      {post.actions.showRespond ? (
        <button
          type="button"
          className="btn-primary"
          onClick={onRespond}
        >
          {post.type === "regalo" ? copy.post.meInteresa : copy.post.yoTengo}
        </button>
      ) : null}

      {!post.actions.showRespond &&
      !post.actions.showOwnerResponses &&
      post.status !== "open" ? (
        <p className="post-detail__status">
          {post.status === "expired"
            ? copy.post.vencio
            : post.status === "open"
              ? statusLabel
              : copy.post.yaResuelto}
        </p>
      ) : null}

      {post.actions.canWithdraw ? (
        <button
          type="button"
          className="btn-danger"
          disabled={busy}
          onClick={() => void onWithdraw()}
        >
          {copy.post.withdraw}
        </button>
      ) : null}

      {note ? <p className="feed__meta">{note}</p> : null}
      {error ? <p className="entrar__error">{error}</p> : null}
    </article>
  );
}
