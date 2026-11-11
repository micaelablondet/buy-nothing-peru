-- M2: post photos (POST-01/02) + chosen_at for later handoff timing

CREATE TABLE post_photos (
  id TEXT PRIMARY KEY NOT NULL,
  post_id TEXT NOT NULL REFERENCES posts (id),
  r2_key TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE (post_id, position)
);

CREATE INDEX post_photos_post_id_idx ON post_photos (post_id);

ALTER TABLE posts ADD COLUMN chosen_at TEXT;
