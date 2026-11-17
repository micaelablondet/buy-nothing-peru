-- Seed data for local / CI (docs/SRD.md §12.4). Safe to re-run after wiping D1.
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
DELETE FROM neighborhoods;
DELETE FROM districts;

-- DEC-30 / DEC-31: Barranco only (migration 0008). No barrio seed.
INSERT OR IGNORE INTO districts (id, name, created_at) VALUES
  ('dist-barranco', 'Barranco', '2026-11-01T00:00:00.000Z');
INSERT INTO districts (id, name, created_at) VALUES
  ('dist-miraflores', 'Miraflores', '2026-11-01T00:00:00.000Z');

INSERT INTO invite_codes (id, code, active, created_at, deactivated_at) VALUES
  ('invite-phase0', 'BARRIO-PILOTO', 1, '2026-11-01T00:00:00.000Z', NULL);

INSERT INTO users (id, google_sub, email, first_name, display_name, whatsapp, district_id, neighborhood_id, is_admin, created_at, deleted_at, invite_accepted_at, email_verified) VALUES
  ('user-mica', 'seed-google-mica', 'mica@example.test', 'Mica', 'Mica', '+51900000001', 'dist-barranco', NULL, 1, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-lucia', 'seed-google-lucia', 'lucia@example.test', 'Lucía', 'Lucía', '+51900000002', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-carlos', 'seed-google-carlos', 'carlos@example.test', 'Carlos', 'Carlos', '+51900000003', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-1', 'seed-google-cap-1', 'cap1@example.test', 'Cap1', 'Cap1', '+51900000011', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-2', 'seed-google-cap-2', 'cap2@example.test', 'Cap2', 'Cap2', '+51900000012', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-3', 'seed-google-cap-3', 'cap3@example.test', 'Cap3', 'Cap3', '+51900000013', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-4', 'seed-google-cap-4', 'cap4@example.test', 'Cap4', 'Cap4', '+51900000014', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-5', 'seed-google-cap-5', 'cap5@example.test', 'Cap5', 'Cap5', '+51900000015', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-6', 'seed-google-cap-6', 'cap6@example.test', 'Cap6', 'Cap6', '+51900000016', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1),
  ('user-cap-7', 'seed-google-cap-7', 'cap7@example.test', 'Cap7', 'Cap7', '+51900000017', 'dist-barranco', NULL, 0, '2026-11-01T00:00:00.000Z', NULL, '2026-11-01T00:00:00.000Z', 1);

-- Open posts for UI (photos in scripts/seed-photos) + M8 e2e fixtures (far-future expiry).
INSERT INTO posts (id, author_id, type, status, title, description, category, district_id, neighborhood_id, created_at, expires_at, chosen_response_id, delivered_at, withdrawn_at, chosen_at, received_confirmed_at, nudge_sent_at) VALUES
  ('post-regalo-pikachu', 'user-mica', 'regalo', 'open', 'Peluche Pikachu', 'Peluche en buen estado. Recojo en el edificio.', 'Juguetes y bebé', 'dist-barranco', NULL, '2026-11-13T18:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-regalo-lonchera', 'user-mica', 'regalo', 'open', 'Lonchera Avengers', 'Lonchera rígida Marvel, con asa y cierre.', 'Juguetes y bebé', 'dist-barranco', NULL, '2026-11-13T17:30:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-regalo-cuisinart', 'user-mica', 'regalo', 'open', 'Accesorios Cuisinart', 'Chopper, vaso, pie de mixer y batidor. Sin el motor.', 'Electrodomésticos', 'dist-barranco', NULL, '2026-11-13T17:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-regalo-peluches', 'user-mica', 'regalo', 'open', 'Dos peluches', 'Oso con corazón y peluche arcoíris. Los dos juntos.', 'Juguetes y bebé', 'dist-barranco', NULL, '2026-11-13T16:30:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-regalo-esqueleto', 'user-mica', 'regalo', 'open', 'Disfraz de esqueleto', 'Enterizo con huesos, máscara y guantes. Talla niño.', 'Ropa', 'dist-barranco', NULL, '2026-11-13T16:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-regalo-bici', 'user-mica', 'regalo', 'open', 'Bicicleta de montaña', 'Bici roja, cambios Shimano. Recojo en el edificio.', 'Otros', 'dist-barranco', NULL, '2026-11-13T15:30:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-open-regalo', 'user-mica', 'regalo', 'open', 'Microondas', 'Funciona bien, un poco viejo. Recojo en el edificio.', 'Electrodomésticos', 'dist-barranco', NULL, '2026-11-08T10:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-open-pido', 'user-lucia', 'pido', 'open', 'Macetas de barro', 'Busco 2 o 3 macetas medianas para el balcón.', 'Plantas y jardín', 'dist-barranco', NULL, '2026-11-08T11:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-at-cap', 'user-mica', 'regalo', 'open', 'Caja de cables', 'Cables USB y cargadores que ya no uso. Varios interesados.', 'Otros', 'dist-barranco', NULL, '2026-11-08T09:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-to-expire', 'user-carlos', 'regalo', 'open', 'Set de vasos', 'Seis vasos de vidrio. Ya no los usamos en casa.', 'Otros', 'dist-barranco', NULL, '2026-10-01T10:00:00.000Z', '2020-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-nudge-ready', 'user-mica', 'regalo', 'open', 'Toallas de baño', 'Dos toallas grandes, casi nuevas. Hay gente interesada.', 'Otros', 'dist-barranco', NULL, '2026-11-01T10:00:00.000Z', '2099-01-01T00:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-chosen', 'user-mica', 'regalo', 'chosen', 'Libros de cocina', 'Tres libros peruanos. Ya coordinamos el recojo.', 'Libros y útiles', 'dist-barranco', NULL, '2026-11-05T10:00:00.000Z', NULL, 'resp-chosen-1', NULL, NULL, '2026-11-05T12:00:00.000Z', NULL, NULL),
  ('post-delivered', 'user-carlos', 'regalo', 'delivered', 'Lámpara de mesa', 'Lámpara blanca con pantalla. Ya se la llevó Mica.', 'Hogar y cocina', 'dist-barranco', NULL, '2026-11-01T10:00:00.000Z', NULL, 'resp-delivered-1', '2026-11-03T18:00:00.000Z', NULL, '2026-11-02T10:00:00.000Z', NULL, NULL),
  ('post-withdrawn', 'user-lucia', 'regalo', 'withdrawn', 'Chaqueta de jean', 'Talla M. Al final me la quedé.', 'Ropa', 'dist-barranco', NULL, '2026-11-02T10:00:00.000Z', NULL, NULL, NULL, '2026-11-04T12:00:00.000Z', NULL, NULL, NULL),
  ('post-expired', 'user-carlos', 'pido', 'expired', 'Sillas de plástico', 'Buscaba un par para la terraza; ya no hace falta.', 'Muebles', 'dist-barranco', NULL, '2026-10-20T10:00:00.000Z', '2026-10-27T10:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-removed', 'user-mica', 'regalo', 'removed', 'Parlante Bluetooth', 'Parlante portátil. Ya no está disponible.', 'Otros', 'dist-barranco', NULL, '2026-11-01T08:00:00.000Z', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
  ('post-closed', 'user-lucia', 'regalo', 'closed', 'Sartén antiadherente', 'Sartén de 24 cm. Coordinamos pero no se concretó el recojo.', 'Hogar y cocina', 'dist-barranco', NULL, '2026-10-01T10:00:00.000Z', NULL, 'resp-closed-1', NULL, NULL, '2026-10-02T12:00:00.000Z', NULL, NULL);

INSERT INTO post_photos (id, post_id, r2_key, position, created_at) VALUES
  ('photo-open-regalo', 'post-open-regalo', 'seed/microondas.jpg', 1, '2026-11-08T10:00:00.000Z'),
  ('photo-pikachu', 'post-regalo-pikachu', 'seed/pikachu.jpg', 1, '2026-11-13T18:00:00.000Z'),
  ('photo-lonchera', 'post-regalo-lonchera', 'seed/lonchera-avengers.jpg', 1, '2026-11-13T17:30:00.000Z'),
  ('photo-cuisinart', 'post-regalo-cuisinart', 'seed/cuisinart.jpg', 1, '2026-11-13T17:00:00.000Z'),
  ('photo-peluches', 'post-regalo-peluches', 'seed/peluches.jpg', 1, '2026-11-13T16:30:00.000Z'),
  ('photo-esqueleto', 'post-regalo-esqueleto', 'seed/disfraz-esqueleto.jpg', 1, '2026-11-13T16:00:00.000Z'),
  ('photo-bici', 'post-regalo-bici', 'seed/bicicleta.jpg', 1, '2026-11-13T15:30:00.000Z');

INSERT INTO notifications (id, user_id, type, post_id, read_at, created_at) VALUES
  ('notif-seed-1', 'user-mica', 'nuevo_interesado', 'post-regalo-cuisinart', NULL, '2026-11-13T17:05:00.000Z'),
  ('notif-seed-2', 'user-lucia', 'te_eligieron', 'post-chosen', '2026-11-05T12:30:00.000Z', '2026-11-05T12:05:00.000Z');

INSERT INTO responses (id, post_id, responder_id, status, note, photo_r2_key, created_at, withdrawn_at) VALUES
  ('resp-active-1', 'post-regalo-cuisinart', 'user-lucia', 'active', 'Me interesan los accesorios', NULL, '2026-11-13T17:05:00.000Z', NULL),
  ('resp-active-2', 'post-regalo-cuisinart', 'user-carlos', 'active', 'Lo puedo pasar a buscar', NULL, '2026-11-13T17:15:00.000Z', NULL),
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
