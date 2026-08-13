-- Add display_order column to the projects table with a default of 0
ALTER TABLE projects ADD COLUMN display_order INT NOT NULL DEFAULT 0;

-- Ensure all existing records are explicitly set to 0
UPDATE projects SET display_order = 0;