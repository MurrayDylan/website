CREATE TABLE project_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id BIGINT NOT NULL,
    label VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,

    CONSTRAINT fk_project_links_project
       FOREIGN KEY (project_id)
           REFERENCES projects(id)
           ON DELETE CASCADE
);

CREATE INDEX idx_project_links_project_id
    ON project_links(project_id);

INSERT INTO project_links (project_id, label, url)
SELECT id, 'Project', project_url
FROM projects
WHERE project_url IS NOT NULL
  AND project_url <> '';

ALTER TABLE projects
DROP COLUMN project_url;