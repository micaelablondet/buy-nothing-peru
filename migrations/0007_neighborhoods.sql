-- DEC-29: barrio (neighborhood) below district.
-- Optional on users; copied onto posts at creation. PUB-01 does not show barrio.

CREATE TABLE neighborhoods (
  id TEXT PRIMARY KEY,
  district_id TEXT NOT NULL REFERENCES districts (id),
  name TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX neighborhoods_district_id_idx ON neighborhoods (district_id);

ALTER TABLE users ADD COLUMN neighborhood_id TEXT REFERENCES neighborhoods (id);
ALTER TABLE posts ADD COLUMN neighborhood_id TEXT REFERENCES neighborhoods (id);

CREATE INDEX users_neighborhood_id_idx ON users (neighborhood_id);
CREATE INDEX posts_neighborhood_id_idx ON posts (neighborhood_id);
