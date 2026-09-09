CREATE TABLE reviews (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);