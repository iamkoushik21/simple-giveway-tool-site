-- Run this in your Supabase SQL Editor

CREATE TABLE entries (
  id          bigserial PRIMARY KEY,
  username    text NOT NULL UNIQUE,       -- one entry per Instagram username
  lucky_number integer NOT NULL UNIQUE,  -- one number per person, never repeated
  ip_address  text NOT NULL UNIQUE,      -- one entry per IP address
  created_at  timestamptz DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_entries_username ON entries (username);
CREATE INDEX idx_entries_lucky_number ON entries (lucky_number);
CREATE INDEX idx_entries_ip_address ON entries (ip_address);

-- Settings Table for Giveaway On/Off
CREATE TABLE settings (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

INSERT INTO settings (key, value) VALUES ('giveaway_status', '{"active": true}');

-- Optional: allow public read so the entries list shows on the page
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read entries"
  ON entries FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT
  USING (true);

-- Writes go through the API route using the service role key (bypasses RLS)
