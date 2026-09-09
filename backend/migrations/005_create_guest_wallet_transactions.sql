CREATE TABLE guest_wallet_transactions (
    id INTEGER PRIMARY KEY,
    wallet_id INTEGER,
    guest_id VARCHAR(100),
    amount NUMERIC(12,2),
    transaction_type VARCHAR(30),
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE
);