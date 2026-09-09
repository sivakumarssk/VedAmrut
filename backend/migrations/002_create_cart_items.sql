CREATE TABLE cart_items (
    id INTEGER PRIMARY KEY,
    cart_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);