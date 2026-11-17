-- DEC-30 / DEC-31: production reference data (empty D1 after migrate had no districts).
-- Idempotent: safe on fresh DB and on DBs that already have these rows from seed.
-- V1 uses district only (DEC-31); do not seed neighborhoods here.

INSERT OR IGNORE INTO districts (id, name, created_at) VALUES
  ('dist-barranco', 'Barranco', '2026-11-01T00:00:00.000Z');
