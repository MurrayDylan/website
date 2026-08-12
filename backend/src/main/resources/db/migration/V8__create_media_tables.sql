-- ============================================================
-- Pages
-- ============================================================

CREATE TABLE pages (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                       slug VARCHAR(100) NOT NULL,

                       title VARCHAR(255) NOT NULL,

                       content TEXT,

                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT uk_pages_slug
                           UNIQUE (slug)
);


-- ============================================================
-- Media
-- ============================================================

CREATE TABLE media (
                       id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                       original_filename VARCHAR(255) NOT NULL,

                       storage_filename VARCHAR(500) NOT NULL UNIQUE,

                       content_type VARCHAR(100) NOT NULL,

                       file_size BIGINT NOT NULL,

                       sha256_hash VARCHAR(64) NOT NULL UNIQUE,

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT uk_media_sha256_hash
                           UNIQUE (sha256_hash)
);


-- ============================================================
-- Project Media
-- ============================================================

CREATE TABLE project_media (
                               id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                               project_id BIGINT NOT NULL,

                               media_id BIGINT NOT NULL,

                               display_order INTEGER NOT NULL DEFAULT 0,

                               caption TEXT,

                               alt_text TEXT,

                               CONSTRAINT fk_project_media_project
                                   FOREIGN KEY (project_id)
                                       REFERENCES projects(id)
                                       ON DELETE CASCADE,

                               CONSTRAINT fk_project_media_media
                                   FOREIGN KEY (media_id)
                                       REFERENCES media(id)
                                       ON DELETE RESTRICT,

                               CONSTRAINT uk_project_media_project_media
                                   UNIQUE (project_id, media_id)
);


-- ============================================================
-- Work Experience Media
-- ============================================================

CREATE TABLE work_media (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                            work_id BIGINT NOT NULL,

                            media_id BIGINT NOT NULL,

                            display_order INTEGER NOT NULL DEFAULT 0,

                            caption TEXT,

                            alt_text TEXT,

                            CONSTRAINT fk_work_media_work
                                FOREIGN KEY (work_id)
                                    REFERENCES work_experience(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_work_media_media
                                FOREIGN KEY (media_id)
                                    REFERENCES media(id)
                                    ON DELETE RESTRICT,

                            CONSTRAINT uk_work_media_work_media
                                UNIQUE (work_id, media_id)
);


-- ============================================================
-- Page Media
-- ============================================================

CREATE TABLE page_media (
                            id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                            page_id BIGINT NOT NULL,

                            media_id BIGINT NOT NULL,

                            display_order INTEGER NOT NULL DEFAULT 0,

                            caption TEXT,

                            alt_text TEXT,

                            CONSTRAINT fk_page_media_page
                                FOREIGN KEY (page_id)
                                    REFERENCES pages(id)
                                    ON DELETE CASCADE,

                            CONSTRAINT fk_page_media_media
                                FOREIGN KEY (media_id)
                                    REFERENCES media(id)
                                    ON DELETE RESTRICT,

                            CONSTRAINT uk_page_media_page_media
                                UNIQUE (page_id, media_id)
);


-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_project_media_project_id
    ON project_media(project_id);

CREATE INDEX idx_project_media_media_id
    ON project_media(media_id);

CREATE INDEX idx_work_media_work_id
    ON work_media(work_id);

CREATE INDEX idx_work_media_media_id
    ON work_media(media_id);

CREATE INDEX idx_page_media_page_id
    ON page_media(page_id);

CREATE INDEX idx_page_media_media_id
    ON page_media(media_id);