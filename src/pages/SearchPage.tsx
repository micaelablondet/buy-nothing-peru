import { useState, type FormEvent } from "react";
import { Link, useOutletContext } from "react-router-dom";
import type { SessionOutletContext } from "@/app/RequireSession";
import { copy } from "@/copy/es-PE";
import { fetchSearch, type PostSummary } from "@/lib/api";

export function SearchPage() {
  const { me } = useOutletContext<SessionOutletContext>();
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const q = draft.trim();
    setQuery(q);
    setError(null);
    if (!q) {
      setPosts([]);
      return;
    }
    setBusy(true);
    setPosts(null);
    try {
      const results = await fetchSearch({
        query: q,
        districtId: me.districtId,
      });
      setPosts(results);
    } catch {
      setError(copy.errors.network);
      setPosts([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="search">
      <h1 className="search__title">{copy.search.title}</h1>
      <p className="search__hint">{copy.search.hint}</p>

      <form className="search__form" onSubmit={(e) => void onSubmit(e)}>
        <label className="search__label" htmlFor="search-q">
          {copy.search.title}
        </label>
        <div className="search__row">
          <input
            id="search-q"
            className="search__input"
            type="search"
            name="q"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={copy.search.placeholder}
            autoComplete="off"
            enterKeyHint="search"
          />
          <button type="submit" className="btn-primary search__submit" disabled={busy}>
            {copy.search.submit}
          </button>
        </div>
      </form>

      {error ? <p className="entrar__error">{error}</p> : null}

      {posts === null && busy ? <p className="feed__meta">…</p> : null}

      {posts !== null && !query ? (
        <p className="feed__empty">{copy.search.emptyQuery}</p>
      ) : null}

      {posts !== null && query && posts.length === 0 && !error ? (
        <p className="feed__empty">
          {copy.search.noResults.replace("{query}", query)}
        </p>
      ) : null}

      {posts && posts.length > 0 ? (
        <ul className="feed__list">
          {posts.map((post) => (
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
                  <p
                    className={
                      post.type === "regalo"
                        ? "feed-card__type feed-card__type--regalo"
                        : "feed-card__type feed-card__type--pido"
                    }
                  >
                    {post.type === "regalo"
                      ? copy.search.typeRegalo
                      : copy.search.typePido}
                  </p>
                  <h2 className="feed-card__title">{post.title}</h2>
                  <p className="feed-card__meta">
                    {post.placeLabel} ·{" "}
                    {copy.feed.by.replace("{name}", post.authorName)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
