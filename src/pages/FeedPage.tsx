import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { FeedCardPhoto } from "@/components/FeedCardPhoto";
import { copy } from "@/copy/es-PE";
import { fetchFeed, type PostSummary, type PostType } from "@/lib/api";
import { formatPostAge } from "@/lib/formatAge";

export function FeedPage() {
  const { me } = useOutletContext<SessionOutletContext>();
  const [type, setType] = useState<PostType>("regalo");
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPosts(null);
    setError(null);
    fetchFeed({
      type,
      districtId: me.districtId,
    })
      .then(setPosts)
      .catch(() => setError(copy.errors.network));
  }, [type, me.districtId]);

  return (
    <section className="feed">
      <div className="feed__tabs" role="tablist" aria-label="Tipo">
        <button
          type="button"
          role="tab"
          aria-selected={type === "regalo"}
          className={`feed__tab${type === "regalo" ? " is-active" : ""}`}
          onClick={() => setType("regalo")}
        >
          {copy.feed.tabRegalos}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={type === "pido"}
          className={`feed__tab${type === "pido" ? " is-active" : ""}`}
          onClick={() => setType("pido")}
        >
          {copy.feed.tabPidos}
        </button>
      </div>

      {error ? <p className="entrar__error">{error}</p> : null}
      {posts === null && !error ? (
        <p className="feed__meta">…</p>
      ) : null}
      {posts && posts.length === 0 ? (
        <p className="feed__empty">
          {type === "regalo" ? copy.feed.emptyRegalos : copy.feed.emptyPidos}
        </p>
      ) : null}

      <ul className="feed__list">
        {(posts ?? []).map((post) => (
          <li key={post.id}>
            <Link to={`/app/p/${post.id}`} className="feed-card">
              <FeedCardPhoto
                url={post.photos[0]?.url}
                emptyAsk={post.type === "pido"}
              />
              <div className="feed-card__body">
                <h2 className="feed-card__title">{post.title}</h2>
                <p className="feed-card__meta">
                  {post.placeLabel} ·{" "}
                  {copy.feed.by.replace("{name}", post.authorName)} ·{" "}
                  {formatPostAge(post.createdAt)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
