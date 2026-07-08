-- Table 1: Main Projects Table
CREATE TABLE projects (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Master Technologies Table
CREATE TABLE technologies (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Table 3: The Many-to-Many Join Table
CREATE TABLE project_technologies (
    project_id BIGINT REFERENCES projects(id) ON DELETE CASCADE,
    technology_id BIGINT REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);