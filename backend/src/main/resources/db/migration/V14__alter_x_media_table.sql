-- Add is_horizontal to page_media
ALTER TABLE page_media 
ADD COLUMN is_horizontal BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_horizontal to project_media
ALTER TABLE project_media 
ADD COLUMN is_horizontal BOOLEAN NOT NULL DEFAULT FALSE;

-- Add is_horizontal to work_media
ALTER TABLE work_media 
ADD COLUMN is_horizontal BOOLEAN NOT NULL DEFAULT FALSE;