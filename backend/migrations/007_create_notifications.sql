CREATE TABLE notifications (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN,
    user_id INTEGER,
    order_id INTEGER,
    created_at TIMESTAMP WITHOUT TIME ZONE
);