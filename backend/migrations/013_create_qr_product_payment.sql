CREATE TABLE qr_product_payments (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    product_id INTEGER,
    qr_code VARCHAR(100),
    product_amount NUMERIC(10,2),
    wallet_amount NUMERIC(10,2),
    upi_amount NUMERIC(10,2),
    payment_method VARCHAR(30),
    payment_status VARCHAR(30),
    gateway_payment_id VARCHAR(255),
    gateway_order_id VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);