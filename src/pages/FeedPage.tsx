import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import {
  fetchCategories,
  fetchFeed,
  type PostSummary,
  type PostType,
} from "@/lib/api";

export function FeedPage() {
  const { me } = useOutletContext<SessionOutletContext>();
  const [type, setType] = useState<PostType>("regalo");
  const [category, setCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setPosts(null);
    setError(null);
    fetchFeed({
      type,
      districtId: me.districtId,
      category,
    })
      .then(setPosts)
      .catch(() => setError(copy.errors.network));
  }, [type, category, me.districtId]);

  return (
    <section className="feed">
      <div className="feed__tabs" role="tablist" aria-label="Tipo">
        <button
          type="button"
          role="tab"
          aria-selected={type === "regalo"}
          className={`feed__tab${type === "regalo" ? " is-active" : ""}`}
          onClick={() => {
            setType("regalo");
            setCategory(null);
          }}
        >
          {copy.feed.tabRegalos}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={type === "pido"}
          className={`feed__tab${type === "pido" ? " is-active" : ""}`}
          onClick={() => {
            setType("pido");
            setCategory(null);
          }}
        >
          {copy.feed.tabPidos}
        </button>
      </div>

      <div className="feed__chips" role="list">
        <button
          type="button"
          className={`feed__chip${!category ? " is-active" : ""}`}
          onClick={() => setCategory(null)}
        >
          {copy.feed.allCategories}
        </button>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`feed__chip${category === item ? " is-active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
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
              {post.photos[0] ? (
                <img
                  className="feed-card__img"
                  src={post.photos[0].url}
                  alt=""
                />
              ) : (
                <div className="feed-card__img feed-card__img--empty" />
              )}
              <div className="feed-card__body">
                <h2 className="feed-card__title">{post.title}</h2>
                <p className="feed-card__meta">
                  {post.category} ·{" "}
                  {copy.feed.by.replace("{name}", post.authorName)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
