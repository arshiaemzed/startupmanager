CREATE TABLE IF NOT EXISTS startups(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (owner)
        REFERENCES users(id)
        ON DELETE CASCADE
);
