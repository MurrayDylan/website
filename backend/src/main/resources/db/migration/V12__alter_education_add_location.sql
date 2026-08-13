ALTER TABLE education
    ADD COLUMN location VARCHAR(255);

UPDATE education
SET location = 'Unknown'
WHERE location IS NULL;

ALTER TABLE education
    ALTER COLUMN location SET NOT NULL;