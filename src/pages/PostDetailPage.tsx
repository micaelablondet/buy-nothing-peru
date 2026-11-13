import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { ReportButton } from "@/components/ReportButton";
import { ResponseSheet } from "@/components/ResponseSheet";
import { SharePostButton } from "@/components/SharePostButton";
import { copy } from "@/copy/es-PE";
import { formatPostAge } from "@/lib/formatAge";
import {
  fetchDistricts,
  fetchPost,
  withdrawMyResponse,
  withdrawPost,
  type PostSummary,
} from "@/lib/api";

export function PostDetailPage() {
  const { id = "" } = useParams();
  const { me } = useOutletContext<SessionOutletContext>();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [post, setPost] = useState<PostSummary | null | undefined>(undefined);
  const [myDistrictName, setMyDistrictName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const reload = () =>
    fetchPost(id)
      .then(setPost)
      .catch(() => {
        setPost(null);
        setError(copy.errors.notFound);
      });

  useEffect(() => {
    void reload();
  }, [id]);

  useEffect(() => {
    fetchDistricts()
      .then((list) => {
        const match = list.find((d) => d.id === me.districtId);
        setMyDistrictName(match?.name ?? "");
      })
      .catch(() => setMyDistrictName(""));
  }, [me.districtId]);

  useEffect(() => {
    const open =
      params.get("responder") === "1" ||
      Boolean((location.state as { openRespond?: boolean } | null)?.openRespond);
    if (open && me.whatsapp) {
      setSheetOpen(true);
    }
  }, [params, location.state, me.whatsapp]);

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

  const actions = post.actions;
  const statusLabel =
    copy.post.status[post.status as keyof typeof copy.post.status] ??
    post.status;

  const onWithdraw = async () => {
    if (!window.confirm(copy.post.withdrawConfirm)) {
      return;
    }
    setBusy(true);
    try {
      setPost(await withdrawPost(post.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
    } finally {
      setBusy(false);
    }
  };

  const onRespond = () => {
    if (!me.whatsapp) {
      navigate("/onboarding/perfil", {
        state: {
          from: { pathname: `/app/p/${post.id}`, search: "?responder=1" },
        },
      });
      return;
    }
    setSheetOpen(true);
  };

  const onWithdrawResponse = async () => {
    if (!actions?.myResponseId) {
      return;
    }
    setBusy(true);
    try {
      await withdrawMyResponse(actions.myResponseId);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
    } finally {
      setBusy(false);
    }
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

      <SharePostButton postId={post.id} />
      <ReportButton postId={post.id} />

      {actions?.showOwnerResponses ? (
        <Link className="btn-primary" to={`/app/p/${post.id}/respuestas`}>
          {post.type === "regalo"
            ? copy.post.verInteresados
            : copy.post.verOfertas}
          {actions.activeResponseCount > 0
            ? ` (${actions.activeResponseCount})`
            : ""}
        </Link>
      ) : null}

      {actions?.showRespond ? (
        <button type="button" className="btn-primary" onClick={onRespond}>
          {post.type === "regalo" ? copy.post.meInteresa : copy.post.yoTengo}
        </button>
      ) : null}

      {actions?.alreadyResponded ? (
        <>
          <p className="post-detail__status">
            {post.type === "regalo"
              ? copy.post.yaTeIntereso
              : copy.post.yaOfreciste}
          </p>
          <button
            type="button"
            className="btn-secondary"
            disabled={busy}
            onClick={() => void onWithdrawResponse()}
          >
            {copy.post.withdrawResponse}
          </button>
        </>
      ) : null}

      {actions?.capped ? (
        <p className="post-detail__status">
          {post.type === "pido" ? copy.post.capPido : copy.post.capRegalo}
        </p>
      ) : null}

      {actions?.showHandoff ? (
        <Link className="btn-primary" to={`/app/p/${post.id}/recojo`}>
          {copy.post.goHandoff}
        </Link>
      ) : null}

      {actions?.statusOnly && !actions.showHandoff ? (
        <p className="post-detail__status">
          {post.status === "expired" ? copy.post.vencio : copy.post.yaResuelto}
        </p>
      ) : null}

      {actions?.canWithdraw ? (
        <button
          type="button"
          className="btn-danger"
          disabled={busy}
          onClick={() => void onWithdraw()}
        >
          {copy.post.withdraw}
        </button>
      ) : null}

      {error ? <p className="entrar__error">{error}</p> : null}

      {sheetOpen ? (
        <ResponseSheet
          postId={post.id}
          postType={post.type}
          displayName={me.displayName}
          districtName={myDistrictName || post.districtName}
          onClose={() => setSheetOpen(false)}
          onDone={() => {
            setSheetOpen(false);
            void reload();
          }}
        />
      ) : null}
    </article>
  );
}
