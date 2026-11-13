import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { copy } from "@/copy/es-PE";
import { formatPostAge } from "@/lib/formatAge";
import {
  fetchNotifications,
  markNotificationRead,
  type InboxItem,
} from "@/lib/api";

export function InboxPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<InboxItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications()
      .then((data) => setItems(data.notifications))
      .catch(() => setError(copy.errors.network));
  }, []);

  const onOpen = async (item: InboxItem) => {
    try {
      await markNotificationRead(item.id);
    } catch {
      // still navigate
    }
    navigate(item.href);
  };

  return (
    <section className="feed">
      <h1 className="publish__title">{copy.inbox.title}</h1>
      {error ? <p className="entrar__error">{error}</p> : null}
      {items && items.length === 0 ? (
        <p className="feed__empty">{copy.inbox.empty}</p>
      ) : null}
      <ul className="feed__list">
        {(items ?? []).map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className={`inbox-item${item.readAt ? "" : " is-unread"}`}
              onClick={() => void onOpen(item)}
            >
              <span className="inbox-item__title">{item.title}</span>
              {item.postTitle ? (
                <span className="inbox-item__meta">
                  {copy.inbox.forPost.replace("{title}", item.postTitle)}
                </span>
              ) : null}
              <span className="inbox-item__meta">
                {formatPostAge(item.createdAt)}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Link to="/app" className="legal__back">
        ← {copy.post.back}
      </Link>
    </section>
  );
}
