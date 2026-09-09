CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(15),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    password VARCHAR(255),
    role VARCHAR(20),
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    address TEXT,
    dob TEXT
);