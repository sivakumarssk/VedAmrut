CREATE TABLE addresses (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    landmark TEXT,
    is_default BOOLEAN,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);