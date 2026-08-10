-- Table 1: Main Work Experience Table
CREATE TABLE work_experience (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN NOT NULL,
    location VARCHAR(255),
    company_website VARCHAR(255),
    company_logo VARCHAR(255),
    description TEXT,
    display_order INTEGER NOT NULL
);

-- Table 2: Many-to-Many Join Table
CREATE TABLE work_technologies (
    work_id BIGINT REFERENCES work_experience(id) ON DELETE CASCADE,
    technology_id BIGINT REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (work_id, technology_id)
);