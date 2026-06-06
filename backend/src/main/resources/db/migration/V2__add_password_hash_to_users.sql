ALTER TABLE app_users
    ADD COLUMN password_hash varchar(255);

UPDATE app_users
SET password_hash = 'local-dev-placeholder'
WHERE password_hash IS NULL;

ALTER TABLE app_users
    ALTER COLUMN password_hash SET NOT NULL;