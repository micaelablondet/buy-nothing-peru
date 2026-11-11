import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import { fetchMyPosts, type PostSummary } from "@/lib/api";

export function MyPostsPage() {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyPosts()
      .then(setPosts)
      .catch(() => setError(copy.errors.network));
  }, []);

  return (
    <section className="feed">
      <h1 className="publish__title">{copy.myPosts.title}</h1>
      {error ? <p className="entrar__error">{error}</p> : null}
      {posts && posts.length === 0 ? (
        <p className="feed__empty">{copy.myPosts.empty}</p>
      ) : null}
      <ul className="feed__list">
        {(posts ?? []).map((post) => {
          const status =
            copy.post.status[post.status as keyof typeof copy.post.status] ??
            post.status;
          return (
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
                    {status} · {post.category}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
