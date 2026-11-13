-- Seed data for local / CI (SPEC.md §12.4). Safe to re-run after wiping D1.
-- WhatsApp numbers exist only in DB for handoff tests — never exposed by open APIs.

DELETE FROM push_subscriptions;
DELETE FROM notifications;
DELETE FROM events;
DELETE FROM post_photos;
DELETE FROM responses;
DELETE FROM posts;
DELETE FROM users;
DELETE FROM invite_codes;
DELETE FROM districts;

INSERT INTO districts (id, name, created_at) VALUES
  ('dist-barranco', 'Barranco', '2026-11-01T00:00:00.000Z'),
  ('dist-miraflores', 'Miraflores', '2026-11-01T00:00:00.000Z');

INSERT INTO invite_codes (id, code, active, created_at, deactivated_at) VALUES
  ('invite-phase0', 'BARRIO-PILOTO', 1, '2026-11-01T00:00:00.000Z', NULL);

INSERT INTO users (id, google_sub, email, first_name, display_name, whatsapp, district_id, is_admin, created_at, deleted_at, invite_accepted_at) VALUES
  ('user-mica', 'seed-google-mica', 'mica@valere.io', 'Mica', 'Mica', '+51900000001', 'dist-barranco', 1, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-lucia', 'seed-google-lucia', 'lucia@example.test', 'Lucía', 'Lucía', '+51900000002', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-carlos', 'seed-google-carlos', 'carlos@example.test', 'Carlos', 'Carlos', '+51900000003', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z');

-- One post per status (categories from POST-08).
INSERT INTO posts (id, author_id, type, status, title, description, category, district_id, created_at, expires_at, chosen_response_id, delivered_at, withdrawn_at, chosen_at, received_confirmed_at, nudge_sent_at) VALUES
  ('post-open-regalo', 'user-mica', 'regalo', 'open', 'Microondas seed', 'Solo para seed / e2e.', 'Electrodomésticos', 'dist-barranco', '2026-11-08T10:00:00.000Z', '2026-11-15T10:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-open-pido', 'user-lucia', 'pido', 'open', 'Macetas seed', 'Solo para seed / e2e.', 'Plantas y jardín', 'dist-barranco', '2026-11-08T11:00:00.000Z', '2026-11-15T11:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-chosen', 'user-mica', 'regalo', 'chosen', 'Libros seed', 'Elegido, no entregado.', 'Libros y útiles', 'dist-barranco', '2026-11-05T10:00:00.000Z', NULL, 'resp-chosen-1', NULL, NULL, '2026-11-05T12:00:00.000Z', NULL, NULL),
  ('post-delivered', 'user-carlos', 'regalo', 'delivered', 'Lámpara seed', 'Entregado.', 'Hogar y cocina', 'dist-barranco', '2026-11-01T10:00:00.000Z', NULL, 'resp-delivered-1', '2026-11-03T18:00:00.000Z', NULL, '2026-11-02T10:00:00.000Z', NULL, NULL),
  ('post-withdrawn', 'user-lucia', 'regalo', 'withdrawn', 'Chaqueta seed', 'Retirado.', 'Ropa', 'dist-barranco', '2026-11-02T10:00:00.000Z', NULL, NULL, NULL, '2026-11-04T12:00:00.000Z', NULL, NULL, NULL),
  ('post-expired', 'user-carlos', 'pido', 'expired', 'Sillas seed', 'Expiró sin elegir.', 'Muebles', 'dist-barranco', '2026-10-20T10:00:00.000Z', '2026-10-27T10:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-removed', 'user-mica', 'regalo', 'removed', 'Item removido', 'Removido por admin.', 'Otros', 'dist-barranco', '2026-11-01T08:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-closed', 'user-lucia', 'regalo', 'closed', 'Cerrado seed', 'Chosen sin Entregado (OQ-05).', 'Hogar y cocina', 'dist-barranco', '2026-10-01T10:00:00.000Z', NULL, 'resp-closed-1', NULL, NULL, '2026-10-02T12:00:00.000Z', NULL, NULL);

INSERT INTO notifications (id, user_id, type, post_id, read_at, created_at) VALUES
  ('notif-seed-1', 'user-mica', 'nuevo_interesado', 'post-open-regalo', NULL, '2026-11-08T12:05:00.000Z'),
  ('notif-seed-2', 'user-lucia', 'te_eligieron', 'post-chosen', '2026-11-05T12:30:00.000Z', '2026-11-05T12:05:00.000Z');

INSERT INTO responses (id, post_id, responder_id, status, note, photo_r2_key, created_at, withdrawn_at) VALUES
  ('resp-active-1', 'post-open-regalo', 'user-lucia', 'active', 'Me interesa el microondas', NULL, '2026-11-08T12:00:00.000Z', NULL),
  ('resp-active-2', 'post-open-regalo', 'user-carlos', 'active', 'Lo puedo pasar a buscar', NULL, '2026-11-08T12:30:00.000Z', NULL),
  ('resp-chosen-1', 'post-chosen', 'user-lucia', 'chosen', 'Me encantan los libros', NULL, '2026-11-05T11:00:00.000Z', NULL),
  ('resp-not-chosen-1', 'post-chosen', 'user-carlos', 'not_chosen', 'También me interesan', NULL, '2026-11-05T11:05:00.000Z', NULL),
  ('resp-delivered-1', 'post-delivered', 'user-mica', 'chosen', 'Gracias', NULL, '2026-11-01T12:00:00.000Z', NULL),
  ('resp-withdrawn-1', 'post-open-pido', 'user-carlos', 'withdrawn', 'Hola, yo tengo esto y te lo regalo.', NULL, '2026-11-08T13:00:00.000Z', '2026-11-08T14:00:00.000Z'),
  ('resp-closed-1', 'post-closed', 'user-carlos', 'chosen', 'Te las ofrezco', NULL, '2026-10-02T10:00:00.000Z', NULL);
