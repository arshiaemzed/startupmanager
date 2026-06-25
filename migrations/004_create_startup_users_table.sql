CREATE TYPE role_type AS ENUM (
    'owner',
    'manager',
    'worker'
);

CREATE TABLE IF NOT EXISTS startup_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role role_type NOT NULL DEFAULT 'worker',
    joined_on TIMESTAMPTZ DEFAULT NOW(),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (startup_id)
        REFERENCES startups(id)
        ON DELETE CASCADE
);