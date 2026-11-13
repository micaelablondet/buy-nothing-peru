import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ReportButton } from "@/components/ReportButton";
import { copy } from "@/copy/es-PE";
import { formatPostAge } from "@/lib/formatAge";
import {
  chooseResponse,
  fetchPost,
  fetchPostResponses,
  type PostSummary,
  type ResponseItem,
} from "@/lib/api";

export function PostResponsesPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostSummary | null>(null);
  const [responses, setResponses] = useState<ResponseItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchPost(id)
      .then(setPost)
      .catch(() => setError(copy.errors.notFound));
    fetchPostResponses(id)
      .then(setResponses)
      .catch(() => setError(copy.errors.forbidden));
  }, [id]);

  const onChoose = async (response: ResponseItem) => {
    if (
      !window.confirm(
        copy.post.chooseConfirm.replace("{name}", response.name),
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await chooseResponse(id, response.id);
      navigate(`/app/p/${id}/recojo`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errors.network);
      setBusy(false);
    }
  };

  return (
    <section className="feed">
      <Link to={`/app/p/${id}`} className="legal__back">
        ← {copy.post.back}
      </Link>
      <h1 className="publish__title">
        {post?.type === "pido"
          ? copy.post.verOfertas
          : copy.post.verInteresados}
      </h1>
      {error ? <p className="entrar__error">{error}</p> : null}
      {responses && responses.length === 0 ? (
        <p className="feed__empty">{copy.post.responsesEmpty}</p>
      ) : null}
      <ul className="feed__list">
        {(responses ?? []).map((item) => (
          <li key={item.id} className="response-card">
            {item.photoUrl ? (
              <img className="feed-card__img" src={item.photoUrl} alt="" />
            ) : null}
            <div className="feed-card__body">
              <h2 className="feed-card__title">{item.name}</h2>
              <p className="feed-card__meta">
                {item.districtName} · {formatPostAge(item.createdAt)}
              </p>
              {item.note ? <p className="response-card__note">{item.note}</p> : null}
              <ReportButton postId={id} responseId={item.id} />
              {post?.status === "open" ? (
                <button
                  type="button"
                  className="btn-primary"
                  disabled={busy}
                  onClick={() => void onChoose(item)}
                >
                  {copy.post.choose}
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
