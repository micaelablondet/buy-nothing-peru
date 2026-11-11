-- Seed data for local / CI (SPEC.md §12.4). Safe to re-run after wiping D1.
-- WhatsApp numbers exist only in DB for handoff tests — never exposed by open APIs.

DELETE FROM responses;
DELETE FROM posts;
DELETE FROM users;
DELETE FROM districts;

INSERT INTO districts (id, name, created_at) VALUES
  ('dist-barranco', 'Barranco', '2026-11-01T00:00:00.000Z');

INSERT INTO users (id, google_sub, email, first_name, whatsapp, district_id, is_admin, created_at, deleted_at) VALUES
  ('user-mica', 'seed-google-mica', 'mica@example.test', 'Mica', '51900000001', 'dist-barranco', 1, '2026-11-01T00:00:00.000Z', NULL),
  ('user-lucia', 'seed-google-lucia', 'lucia@example.test', 'Lucía', '51900000002', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL),
  ('user-carlos', 'seed-google-carlos', 'carlos@example.test', 'Carlos', '51900000003', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL);

-- One post per status (minimal titles for e2e later).
INSERT INTO posts (id, author_id, type, status, title, description, category, district_id, created_at, expires_at, chosen_response_id, delivered_at, withdrawn_at) VALUES
  ('post-open-regalo', 'user-mica', 'regalo', 'open', 'Microondas seed', 'Solo para seed / e2e.', 'Electrónicos', 'dist-barranco', '2026-11-08T10:00:00.000Z', '2026-11-15T10:00:00.000Z', NULL, NULL, NULL),
  ('post-open-pido', 'user-lucia', 'pido', 'open', 'Macetas seed', 'Solo para seed / e2e.', 'Hogar', 'dist-barranco', '2026-11-08T11:00:00.000Z', '2026-11-15T11:00:00.000Z', NULL, NULL, NULL),
  ('post-chosen', 'user-mica', 'regalo', 'chosen', 'Libros seed', 'Elegido, no entregado.', 'Libros', 'dist-barranco', '2026-11-05T10:00:00.000Z', NULL, 'resp-chosen-1', NULL, NULL),
  ('post-delivered', 'user-carlos', 'regalo', 'delivered', 'Lámpara seed', 'Entregado.', 'Hogar', 'dist-barranco', '2026-11-01T10:00:00.000Z', NULL, 'resp-delivered-1', '2026-11-03T18:00:00.000Z', NULL),
  ('post-withdrawn', 'user-lucia', 'regalo', 'withdrawn', 'Chaqueta seed', 'Retirado.', 'Ropa', 'dist-barranco', '2026-11-02T10:00:00.000Z', NULL, NULL, NULL, '2026-11-04T12:00:00.000Z'),
  ('post-expired', 'user-carlos', 'pido', 'expired', 'Sillas seed', 'Expiró sin elegir.', 'Hogar', 'dist-barranco', '2026-10-20T10:00:00.000Z', '2026-10-27T10:00:00.000Z', NULL, NULL, NULL),
  ('post-removed', 'user-mica', 'regalo', 'removed', 'Item removido', 'Removido por admin.', 'Otros', 'dist-barranco', '2026-11-01T08:00:00.000Z', NULL, NULL, NULL, NULL),
  ('post-closed', 'user-lucia', 'regalo', 'closed', 'Cerrado seed', 'Chosen sin Entregado (OQ-05).', 'Hogar', 'dist-barranco', '2026-10-01T10:00:00.000Z', NULL, 'resp-closed-1', NULL, NULL);

INSERT INTO responses (id, post_id, responder_id, status, created_at, withdrawn_at) VALUES
  ('resp-active-1', 'post-open-regalo', 'user-lucia', 'active', '2026-11-08T12:00:00.000Z', NULL),
  ('resp-active-2', 'post-open-regalo', 'user-carlos', 'active', '2026-11-08T12:30:00.000Z', NULL),
  ('resp-chosen-1', 'post-chosen', 'user-lucia', 'chosen', '2026-11-05T11:00:00.000Z', NULL),
  ('resp-not-chosen-1', 'post-chosen', 'user-carlos', 'not_chosen', '2026-11-05T11:05:00.000Z', NULL),
  ('resp-delivered-1', 'post-delivered', 'user-mica', 'chosen', '2026-11-01T12:00:00.000Z', NULL),
  ('resp-withdrawn-1', 'post-open-pido', 'user-carlos', 'withdrawn', '2026-11-08T13:00:00.000Z', '2026-11-08T14:00:00.000Z'),
  ('resp-closed-1', 'post-closed', 'user-carlos', 'chosen', '2026-10-02T10:00:00.000Z', NULL);
