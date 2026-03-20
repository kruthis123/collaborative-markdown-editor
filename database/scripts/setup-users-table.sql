CREATE TABLE IF NOT EXISTS userprofile (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100)
);

INSERT INTO userprofile (email, password_hash, name) VALUES 
('admin@example.com', '$2b$10$7igBZsQhjXdJZRMf5v/gaeLrLoOyYBkuQds2P5Yp5t6jpFY3s8Lvq', 'Admin User'), -- Password@1
('you@example.com', '$2b$10$7igBZsQhjXdJZRMf5v/gaeLrLoOyYBkuQds2P5Yp5t6jpFY3s8Lvq', 'John Doe'); -- Password@1