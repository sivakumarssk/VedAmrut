CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    address_line TEXT,
    area VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    total_amount NUMERIC(10,2),
    payment_method VARCHAR(30),
    status VARCHAR(30),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);