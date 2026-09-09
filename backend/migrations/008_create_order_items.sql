CREATE TABLE order_items (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price NUMERIC(10,2),
    created_at TIMESTAMP WITHOUT TIME ZONE
);