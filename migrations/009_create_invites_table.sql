CREATE TYPE invite_status AS ENUM (
    'pending',
    'accepted',
    'declined',
    'expired'
);


CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    startup_id UUID NOT NULL,
    user_id UUID NOT NULL,
    invited_by UUID NOT NULL,
    invited_at TIMESTAMPTZ DEFAULT NOW(),
    status invite_status NOT NULL DEFAULT 'pending',

    CONSTRAINT fk_invites_user 
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_invites_startup
        FOREIGN KEY (startup_id)
        REFERENCES startups(id)
        ON DELETE CASCADE,
    
    CONSTRAINT fk_invited_by
        FOREIGN KEY (invited_by)
        REFERENCES users(id)
        ON DELETE CASCADE,

    UNIQUE (startup_id, user_id)
);