CREATE TABLE wallets (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    balance NUMERIC(10,2),
    created_at TIMESTAMP WITHOUT TIME ZONE,
    updated_at TIMESTAMP WITHOUT TIME ZONE
);