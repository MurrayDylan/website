CREATE TABLE site_settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    email VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    linkedin_url VARCHAR(255) NULL,
    social_one VARCHAR(255) NULL,
    social_two VARCHAR(255) NULL,
    social_three VARCHAR(255) NULL,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- Insert the mandatory default singleton row
INSERT INTO site_settings (id) VALUES (1);