-- M3: response notes/photos, handoff fields, notifications stub, events

ALTER TABLE responses ADD COLUMN note TEXT;
ALTER TABLE responses ADD COLUMN photo_r2_key TEXT;

ALTER TABLE posts ADD COLUMN received_confirmed_at TEXT;
ALTER TABLE posts ADD COLUMN disc_answer TEXT;

CREATE TABLE notifications (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id),
  type TEXT NOT NULL,
  post_id TEXT REFERENCES posts (id),
  read_at TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX notifications_user_id_idx ON notifications (user_id, created_at);

CREATE TABLE events (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT,
  name TEXT NOT NULL,
  props TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX events_name_created_idx ON events (name, created_at);
