-- Ihouses shared schema: PostgreSQL, consumed by both the Next.js frontend
-- (via Prisma) and the Python scraping/matching/alerts backend (via SQLAlchemy).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email             TEXT UNIQUE NOT NULL,
    telegram_chat_id  TEXT UNIQUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    income_monthly  NUMERIC(10, 2),
    profession      TEXT,
    has_pets        BOOLEAN NOT NULL DEFAULT false,
    lifestyle        TEXT,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS search_filters (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    city           TEXT NOT NULL,
    max_budget     NUMERIC(10, 2) NOT NULL,
    radius_km      INTEGER NOT NULL DEFAULT 5,
    property_type  TEXT,
    is_active      BOOLEAN NOT NULL DEFAULT true,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts_history (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_title       TEXT NOT NULL,
    listing_price       NUMERIC(10, 2),
    listing_url         TEXT NOT NULL,
    listing_source      TEXT NOT NULL,
    motivation_letter   TEXT,
    sent_to_telegram    BOOLEAN NOT NULL DEFAULT false,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_filters_user_active
    ON search_filters (user_id) WHERE is_active;

CREATE INDEX IF NOT EXISTS idx_alerts_history_user_created
    ON alerts_history (user_id, created_at DESC);

-- Demo user for the local MVP (no auth yet — the frontend and backend both
-- operate against this fixed user until real authentication is added).
INSERT INTO users (id, email, telegram_chat_id)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@ihouses.local', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profiles (user_id, income_monthly, profession, has_pets, lifestyle)
VALUES ('00000000-0000-0000-0000-000000000001', 3200.00, 'Software Engineer', false, 'Non-smoker, quiet, works from home')
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO search_filters (user_id, city, max_budget, radius_km, property_type, is_active)
VALUES ('00000000-0000-0000-0000-000000000001', 'Amsterdam', 1800.00, 10, 'apartment', true)
ON CONFLICT DO NOTHING;
