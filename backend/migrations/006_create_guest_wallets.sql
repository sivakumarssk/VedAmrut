CREATE TABLE guest_wallets (
    id INTEGER PRIMARY KEY,
    guest_id VARCHAR(100),
    balance NUMERIC(12,2),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);