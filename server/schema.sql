-- Vedic Marriage Compatibility — database schema
-- Manual alternative to `npm run db:push` (drizzle-kit).
--   psql "$DATABASE_URL" -f server/schema.sql

CREATE TABLE IF NOT EXISTS match_reports (
  id          SERIAL PRIMARY KEY,
  token_hash  TEXT NOT NULL,
  request     JSONB NOT NULL,
  report      JSONB NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_match_reports_created_at
  ON match_reports (created_at DESC);
