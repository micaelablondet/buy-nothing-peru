import { Link, useParams } from "react-router-dom";
import { copy } from "@/copy/es-PE";

/** M2 stub: response list UI arrives with RESP in M3. */
export function PostResponsesPage() {
  const { id = "" } = useParams();
  return (
    <section className="empty-panel">
      <Link to={`/app/p/${id}`} className="legal__back">
        ← {copy.post.back}
      </Link>
      <h1 className="empty-panel__title">{copy.post.verInteresados}</h1>
      <p className="empty-panel__body">{copy.post.responsesEmpty}</p>
    </section>
  );
}
