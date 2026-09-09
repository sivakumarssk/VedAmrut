CREATE TABLE wallet_transactions (
    id INTEGER PRIMARY KEY,
    wallet_id INTEGER,
    user_id INTEGER,
    amount NUMERIC(10,2),
    transaction_type VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    balance_after NUMERIC(12,2)
);