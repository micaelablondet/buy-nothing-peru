-- Seed data for local / CI (SPEC.md §12.4). Safe to re-run after wiping D1.
-- WhatsApp numbers exist only in DB for handoff tests — never exposed by open APIs.

DELETE FROM push_subscriptions;
DELETE FROM rate_counters;
DELETE FROM reports;
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
  ('user-mica', 'seed-google-mica', 'mica@example.test', 'Mica', 'Mica', '+51900000001', 'dist-barranco', 1, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-lucia', 'seed-google-lucia', 'lucia@example.test', 'Lucía', 'Lucía', '+51900000002', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-carlos', 'seed-google-carlos', 'carlos@example.test', 'Carlos', 'Carlos', '+51900000003', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-1', 'seed-google-cap-1', 'cap1@example.test', 'Cap1', 'Cap1', '+51900000011', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-2', 'seed-google-cap-2', 'cap2@example.test', 'Cap2', 'Cap2', '+51900000012', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-3', 'seed-google-cap-3', 'cap3@example.test', 'Cap3', 'Cap3', '+51900000013', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-4', 'seed-google-cap-4', 'cap4@example.test', 'Cap4', 'Cap4', '+51900000014', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-5', 'seed-google-cap-5', 'cap5@example.test', 'Cap5', 'Cap5', '+51900000015', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-6', 'seed-google-cap-6', 'cap6@example.test', 'Cap6', 'Cap6', '+51900000016', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z'),
  ('user-cap-7', 'seed-google-cap-7', 'cap7@example.test', 'Cap7', 'Cap7', '+51900000017', 'dist-barranco', 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z');

-- One post per status (categories from POST-08). Open posts expire far in the future so e2e stays stable.
INSERT INTO posts (id, author_id, type, status, title, description, category, district_id, created_at, expires_at, chosen_response_id, delivered_at, withdrawn_at, chosen_at, received_confirmed_at, nudge_sent_at) VALUES
  ('post-open-regalo', 'user-mica', 'regalo', 'open', 'Microondas seed', 'Solo para seed / e2e.', 'Electrodomésticos', 'dist-barranco', '2026-11-08T10:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-open-pido', 'user-lucia', 'pido', 'open', 'Macetas seed', 'Solo para seed / e2e.', 'Plantas y jardín', 'dist-barranco', '2026-11-08T11:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-at-cap', 'user-mica', 'regalo', 'open', 'Cap 7 seed', 'Ya tiene 7 interesados.', 'Otros', 'dist-barranco', '2026-11-08T09:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-to-expire', 'user-carlos', 'regalo', 'open', 'Expira ya', 'Para job de expiración.', 'Otros', 'dist-barranco', '2026-10-01T10:00:00.000Z', '2020-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-nudge-ready', 'user-mica', 'regalo', 'open', 'Nudge listo', 'Primera respuesta hace >48h.', 'Otros', 'dist-barranco', '2026-11-01T10:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
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
  ('resp-closed-1', 'post-closed', 'user-carlos', 'chosen', 'Te las ofrezco', NULL, '2026-10-02T10:00:00.000Z', NULL),
  ('resp-cap-1', 'post-at-cap', 'user-cap-1', 'active', '1', NULL, '2026-11-08T09:01:00.000Z', NULL),
  ('resp-cap-2', 'post-at-cap', 'user-cap-2', 'active', '2', NULL, '2026-11-08T09:02:00.000Z', NULL),
  ('resp-cap-3', 'post-at-cap', 'user-cap-3', 'active', '3', NULL, '2026-11-08T09:03:00.000Z', NULL),
  ('resp-cap-4', 'post-at-cap', 'user-cap-4', 'active', '4', NULL, '2026-11-08T09:04:00.000Z', NULL),
  ('resp-cap-5', 'post-at-cap', 'user-cap-5', 'active', '5', NULL, '2026-11-08T09:05:00.000Z', NULL),
  ('resp-cap-6', 'post-at-cap', 'user-cap-6', 'active', '6', NULL, '2026-11-08T09:06:00.000Z', NULL),
  ('resp-cap-7', 'post-at-cap', 'user-cap-7', 'active', '7', NULL, '2026-11-08T09:07:00.000Z', NULL),
  ('resp-nudge-1', 'post-nudge-ready', 'user-lucia', 'active', 'Llevo días esperando', NULL, '2026-11-01T12:00:00.000Z', NULL);
