-- DEC-30: production reference data (empty D1 after migrate had no districts).
-- Idempotent: safe on fresh DB and on DBs that already have these rows from seed.

INSERT OR IGNORE INTO districts (id, name, created_at) VALUES
  ('dist-barranco', 'Barranco', '2026-11-01T00:00:00.000Z');

INSERT OR IGNORE INTO neighborhoods (id, district_id, name, created_at) VALUES
  ('nbh-torres-paz', 'dist-barranco', 'Torres Paz', '2026-11-01T00:00:00.000Z');
