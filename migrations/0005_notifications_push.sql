-- M4: push subscriptions + nudge bookkeeping (NOTIF-02/04)

CREATE TABLE push_subscriptions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX push_subscriptions_user_id_idx ON push_subscriptions (user_id);

ALTER TABLE posts ADD COLUMN nudge_sent_at TEXT;
