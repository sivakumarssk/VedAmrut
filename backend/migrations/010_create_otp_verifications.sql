CREATE TABLE otp_verifications (
    id INTEGER PRIMARY KEY,
    phone VARCHAR(15),
    otp VARCHAR(6),
    expires_at TIMESTAMP WITHOUT TIME ZONE,
    verified BOOLEAN,
    created_at TIMESTAMP WITHOUT TIME ZONE
);