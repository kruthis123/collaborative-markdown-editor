CREATE TABLE IF NOT EXISTS document (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES userprofile(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS document_access (
    document_id INTEGER NOT NULL REFERENCES document(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES userprofile(id) ON DELETE CASCADE,
    PRIMARY KEY (document_id, user_id)
);

-- Insert sample document owned by first user (admin@example.com)
INSERT INTO document (title, storage_path, owner_id) VALUES 
('Client A Design Document', 'client-A-design-1.md', 1);

-- Grant access to second user (user@example.com)
INSERT INTO document_access (document_id, user_id) VALUES 
(1, 2);