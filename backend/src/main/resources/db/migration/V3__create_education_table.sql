CREATE TABLE education (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    institution VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    current BOOLEAN NOT NULL DEFAULT FALSE,
    grade VARCHAR(100),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0
);


CREATE TABLE modules (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    education_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    grade VARCHAR(50),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_module_education
     FOREIGN KEY (education_id)
         REFERENCES education(id)
         ON DELETE CASCADE
);


CREATE TABLE module_topics (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_topic_module
       FOREIGN KEY (module_id)
           REFERENCES modules(id)
           ON DELETE CASCADE
);