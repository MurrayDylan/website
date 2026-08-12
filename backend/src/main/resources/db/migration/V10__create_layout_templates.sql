CREATE TABLE layout_templates (
    layout_type VARCHAR(50) PRIMARY KEY,
    default_metadata JSONB,
    default_content TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO layout_templates (layout_type, default_metadata, default_content) VALUES
    ('DISSERTATION', '{"degree": "", "datasetName": "", "githubUrl": ""}'::jsonb, ''),
    ('ABOUT',        '{"location": "", "status": "", "githubUrl": "", "linkedinUrl": ""}'::jsonb, ''),
    ('CONTACT',      '{"email": "", "linkedinUrl": "", "githubUrl": ""}'::jsonb, ''),
    ('SKILLS',       '{"featuredCategories": []}'::jsonb, ''),
    ('STANDARD',     '{}'::jsonb, '');
