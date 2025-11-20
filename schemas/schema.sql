DROP TABLE IF EXISTS webhooks;

CREATE TABLE IF NOT EXISTS webhooks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk mempercepat query by created_at
CREATE INDEX IF NOT EXISTS idx_webhooks_created_at ON webhooks (created_at);
