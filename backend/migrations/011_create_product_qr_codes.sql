CREATE TABLE product_qr_codes (
    id INTEGER PRIMARY KEY,
    product_id INTEGER,
    qr_code VARCHAR(100),
    reward_amount NUMERIC(10,2),
    is_claimed BOOLEAN,
    claimed_by INTEGER,
    claimed_at TIMESTAMP WITHOUT TIME ZONE,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    unit_number INTEGER
);