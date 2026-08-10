-- Table 1: Editable content pages
CREATE TABLE pages (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Table 2: Master Media Table
CREATE TABLE media (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    file_hash VARCHAR(64) NOT NULL UNIQUE,

    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL UNIQUE,

    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,

    storage_key VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Table 3: Project <-> Media
CREATE TABLE project_media (
    project_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,
    caption TEXT,
    alt_text TEXT,

    PRIMARY KEY (project_id, media_id),

    CONSTRAINT fk_project_media_project
        FOREIGN KEY (project_id)
            REFERENCES projects(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_project_media_media
        FOREIGN KEY (media_id)
            REFERENCES media(id)
            ON DELETE CASCADE
);


-- Table 4: Work Experience <-> Media
CREATE TABLE work_experience_media (
    work_experience_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,
    caption TEXT,
    alt_text TEXT,

    PRIMARY KEY (work_experience_id, media_id),

    CONSTRAINT fk_work_experience_media_work
        FOREIGN KEY (work_experience_id)
            REFERENCES work_experience(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_work_experience_media_media
        FOREIGN KEY (media_id)
            REFERENCES media(id)
            ON DELETE CASCADE
);


-- Table 5: Page <-> Media
CREATE TABLE page_media (
    page_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,
    caption TEXT,
    alt_text TEXT,

    PRIMARY KEY (page_id, media_id),

    CONSTRAINT fk_page_media_page
        FOREIGN KEY (page_id)
            REFERENCES pages(id)
            ON DELETE CASCADE,

    CONSTRAINT fk_page_media_media
        FOREIGN KEY (media_id)
            REFERENCES media(id)
            ON DELETE CASCADE
);


-- Indexes for looking up media belonging to each parent.
CREATE INDEX idx_project_media_project_id
    ON project_media(project_id);

CREATE INDEX idx_project_media_media_id
    ON project_media(media_id);

CREATE INDEX idx_work_experience_media_work_id
    ON work_experience_media(work_experience_id);

CREATE INDEX idx_work_experience_media_media_id
    ON work_experience_media(media_id);

CREATE INDEX idx_page_media_page_id
    ON page_media(page_id);

CREATE INDEX idx_page_media_media_id
    ON page_media(media_id);
