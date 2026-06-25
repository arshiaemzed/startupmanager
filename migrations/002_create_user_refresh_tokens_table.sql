CREATE TABLE IF NOT EXISTS user_refresh_tokens(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
      
    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);