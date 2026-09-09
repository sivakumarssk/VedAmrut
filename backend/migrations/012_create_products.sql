CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(150),
    description TEXT,
    price NUMERIC(10,2),
    image TEXT,
    stock INTEGER,
    category_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE,
    qr_reward_amount NUMERIC(10,2),
    reward_amount NUMERIC(10,2),
    old_price NUMERIC(10,2)
);