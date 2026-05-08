-- supabase/migrations/20260426000000_set_events_id_default.sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
ALTER TABLE "Events" ALTER COLUMN id SET DEFAULT gen_random_uuid();