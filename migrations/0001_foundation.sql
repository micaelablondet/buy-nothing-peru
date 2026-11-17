-- M0 foundation schema (minimal). Posts/responses expand in M2–M3.
-- Status values align with SPEC.md §7.3 / §7.4.

CREATE TABLE districts (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY NOT NULL,
  google_sub TEXT UNIQUE,
  email TEXT,
  first_name TEXT NOT NULL,
  whatsapp TEXT,
  district_id TEXT REFERENCES districts (id),
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE INDEX users_district_id_idx ON users (district_id);

CREATE TABLE posts (
  id TEXT PRIMARY KEY NOT NULL,
  author_id TEXT NOT NULL REFERENCES users (id),
  type TEXT NOT NULL CHECK (type IN ('regalo', 'pido')),
  status TEXT NOT NULL CHECK (
    status IN (
      'open',
      'chosen',
      'delivered',
      'withdrawn',
      'expired',
      'removed',
      'closed'
    )
  ),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  district_id TEXT NOT NULL REFERENCES districts (id),
  created_at TEXT NOT NULL,
  expires_at TEXT,
  chosen_response_id TEXT,
  delivered_at TEXT,
  withdrawn_at TEXT
);

CREATE INDEX posts_district_status_idx ON posts (district_id, status);
CREATE INDEX posts_author_id_idx ON posts (author_id);

CREATE TABLE responses (
  id TEXT PRIMARY KEY NOT NULL,
  post_id TEXT NOT NULL REFERENCES posts (id),
  responder_id TEXT NOT NULL REFERENCES users (id),
  status TEXT NOT NULL CHECK (
    status IN ('active', 'chosen', 'not_chosen', 'withdrawn')
  ),
  created_at TEXT NOT NULL,
  withdrawn_at TEXT,
  UNIQUE (post_id, responder_id)
);

CREATE INDEX responses_post_id_idx ON responses (post_id);
