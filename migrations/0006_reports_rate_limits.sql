-- M6: reports (SAFE-01) + rate-limit buckets (SAFE-04)

CREATE TABLE reports (
  id TEXT PRIMARY KEY NOT NULL,
  reporter_id TEXT NOT NULL REFERENCES users (id),
  post_id TEXT NOT NULL REFERENCES posts (id),
  response_id TEXT REFERENCES responses (id),
  reason TEXT NOT NULL,
  text TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  created_at TEXT NOT NULL
);

CREATE INDEX reports_status_created_idx ON reports (status, created_at);
CREATE INDEX reports_post_id_idx ON reports (post_id);

CREATE TABLE rate_counters (
  bucket_key TEXT PRIMARY KEY NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  window_end TEXT NOT NULL
);
