-- M1: invite codes + profile completion fields (AUTH-02, PROF-01–04)

CREATE TABLE invite_codes (
  id TEXT PRIMARY KEY NOT NULL,
  code TEXT NOT NULL UNIQUE,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  deactivated_at TEXT
);

CREATE INDEX invite_codes_active_idx ON invite_codes (active);

ALTER TABLE users ADD COLUMN invite_accepted_at TEXT;
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Backfill display_name from first_name for existing seed rows
UPDATE users SET display_name = first_name WHERE display_name IS NULL;
