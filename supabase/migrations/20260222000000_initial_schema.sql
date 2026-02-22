-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================================
-- TABLE: dog_parks
-- ============================================================
CREATE TABLE public.dog_parks (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  address          TEXT NOT NULL,
  city             TEXT NOT NULL,
  state            TEXT NOT NULL DEFAULT 'FL',
  zip_code         TEXT,
  latitude         DOUBLE PRECISION NOT NULL,
  longitude        DOUBLE PRECISION NOT NULL,
  acres            NUMERIC(6, 2),
  size_label       TEXT,
  is_fenced        BOOLEAN NOT NULL DEFAULT FALSE,
  has_small_dog_area BOOLEAN NOT NULL DEFAULT FALSE,
  has_water_station  BOOLEAN NOT NULL DEFAULT FALSE,
  has_lighting       BOOLEAN NOT NULL DEFAULT FALSE,
  has_parking        BOOLEAN NOT NULL DEFAULT FALSE,
  has_restrooms      BOOLEAN NOT NULL DEFAULT FALSE,
  has_benches_shade  BOOLEAN NOT NULL DEFAULT FALSE,
  is_leash_free      BOOLEAN NOT NULL DEFAULT TRUE,
  hours            TEXT,
  phone            TEXT,
  website_url      TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dog_parks_updated_at
  BEFORE UPDATE ON public.dog_parks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_dog_parks_city ON public.dog_parks (city);


-- ============================================================
-- TABLE: park_visits
-- ============================================================
CREATE TABLE public.park_visits (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anonymous_user_id UUID NOT NULL,
  park_id           UUID NOT NULL REFERENCES public.dog_parks(id) ON DELETE CASCADE,
  visited_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_park UNIQUE (anonymous_user_id, park_id)
);

CREATE INDEX idx_park_visits_user ON public.park_visits (anonymous_user_id);
CREATE INDEX idx_park_visits_park ON public.park_visits (park_id);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- dog_parks: public read, no writes from client
ALTER TABLE public.dog_parks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read dog parks"
  ON public.dog_parks
  FOR SELECT
  USING (true);

-- park_visits: anon users can only see/write their own records
ALTER TABLE public.park_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own visits"
  ON public.park_visits
  FOR SELECT
  USING (
    anonymous_user_id = (current_setting('request.headers', true)::json->>'x-anonymous-user-id')::uuid
  );

CREATE POLICY "Users can insert own visits"
  ON public.park_visits
  FOR INSERT
  WITH CHECK (
    anonymous_user_id = (current_setting('request.headers', true)::json->>'x-anonymous-user-id')::uuid
  );

CREATE POLICY "Users can delete own visits"
  ON public.park_visits
  FOR DELETE
  USING (
    anonymous_user_id = (current_setting('request.headers', true)::json->>'x-anonymous-user-id')::uuid
  );
