ALTER TABLE technologies
    ADD COLUMN category VARCHAR(100);

UPDATE technologies
SET category = 'Other';

ALTER TABLE technologies
    ALTER COLUMN category SET NOT NULL;