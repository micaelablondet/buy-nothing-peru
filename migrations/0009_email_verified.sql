-- Google email_verified (AUTH-04 / invite bypass): only verified emails can be admin.
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
