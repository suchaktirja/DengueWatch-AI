-- ============================================================
-- DengueWatch AI — Database Schema Migration
-- Target Platform: Supabase (PostgreSQL 17)
-- ============================================================

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ------------------------------------------------------------
-- TABLE: wards
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wards (
    id                  TEXT            PRIMARY KEY,
    ward_name           TEXT            NOT NULL,
    ward_number         INTEGER         NOT NULL,
    city                TEXT            NOT NULL,
    district_name       TEXT,
    population          INTEGER,
    population_density  NUMERIC(10,2),
    area_km2            NUMERIC(8,4),
    latitude            NUMERIC(10,7),
    longitude           NUMERIC(10,7),
    water_logging_risk  TEXT            CHECK (water_logging_risk IN ('Low', 'Moderate', 'High', 'Severe')),
    sanitation_score    INTEGER         CHECK (sanitation_score BETWEEN 0 AND 100),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wards_city               ON public.wards (city);
CREATE INDEX IF NOT EXISTS idx_wards_water_logging_risk ON public.wards (water_logging_risk);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'trg_wards_updated_at'
    ) THEN
        CREATE TRIGGER trg_wards_updated_at
            BEFORE UPDATE ON public.wards
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;

-- ------------------------------------------------------------
-- TABLE: dengue_cases
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dengue_cases (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id         TEXT        NOT NULL REFERENCES public.wards (id) ON DELETE CASCADE,
    report_date     DATE        NOT NULL,
    reported_cases  INTEGER     NOT NULL CHECK (reported_cases >= 0),
    source          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_dengue_cases_ward_date UNIQUE (ward_id, report_date)
);

CREATE INDEX IF NOT EXISTS idx_dengue_cases_ward_id     ON public.dengue_cases (ward_id);
CREATE INDEX IF NOT EXISTS idx_dengue_cases_report_date ON public.dengue_cases (report_date);

-- ------------------------------------------------------------
-- TABLE: weather_data
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_data (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id             TEXT            NOT NULL REFERENCES public.wards (id) ON DELETE CASCADE,
    observation_date    DATE            NOT NULL,
    rainfall_mm         NUMERIC(7,2)    CHECK (rainfall_mm >= 0),
    temperature_avg_c   NUMERIC(5,2),
    temperature_max_c   NUMERIC(5,2),
    temperature_min_c   NUMERIC(5,2),
    humidity_pct        NUMERIC(5,2)    CHECK (humidity_pct BETWEEN 0 AND 100),
    source              TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now(),
    CONSTRAINT uq_weather_data_ward_date UNIQUE (ward_id, observation_date)
);

CREATE INDEX IF NOT EXISTS idx_weather_data_ward_id          ON public.weather_data (ward_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_observation_date ON public.weather_data (observation_date);

-- ------------------------------------------------------------
-- TABLE: risk_predictions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.risk_predictions (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id             TEXT            NOT NULL REFERENCES public.wards (id) ON DELETE CASCADE,
    risk_score          INTEGER         NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level          TEXT            NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    predicted_cases     INTEGER         CHECK (predicted_cases >= 0),
    confidence_pct      NUMERIC(5,2)    CHECK (confidence_pct BETWEEN 0 AND 100),
    prediction_date     DATE            NOT NULL,
    target_week_start   DATE            NOT NULL,
    target_week_end     DATE            NOT NULL,
    model_version       TEXT,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_ward_date
    ON public.risk_predictions (ward_id, prediction_date DESC);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_risk_level
    ON public.risk_predictions (risk_level);

-- ------------------------------------------------------------
-- TABLE: alerts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.alerts (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    ward_id     TEXT        NOT NULL REFERENCES public.wards (id) ON DELETE CASCADE,
    alert_date  DATE        NOT NULL,
    alert_type  TEXT        NOT NULL CHECK (alert_type IN ('high_risk', 'critical_risk', 'outbreak')),
    message     TEXT        NOT NULL,
    risk_score  INTEGER     CHECK (risk_score BETWEEN 0 AND 100),
    resolved    BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_ward_date ON public.alerts (ward_id, alert_date DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved  ON public.alerts (resolved);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY & POLICIES
-- ------------------------------------------------------------
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dengue_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.wards TO anon, authenticated;
GRANT SELECT ON public.dengue_cases TO anon, authenticated;
GRANT SELECT ON public.weather_data TO anon, authenticated;
GRANT SELECT ON public.risk_predictions TO anon, authenticated;
GRANT SELECT ON public.alerts TO anon, authenticated;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'wards' AND policyname = 'Allow public read access to wards') THEN
        CREATE POLICY "Allow public read access to wards" ON public.wards FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'dengue_cases' AND policyname = 'Allow public read access to dengue_cases') THEN
        CREATE POLICY "Allow public read access to dengue_cases" ON public.dengue_cases FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'weather_data' AND policyname = 'Allow public read access to weather_data') THEN
        CREATE POLICY "Allow public read access to weather_data" ON public.weather_data FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'risk_predictions' AND policyname = 'Allow public read access to risk_predictions') THEN
        CREATE POLICY "Allow public read access to risk_predictions" ON public.risk_predictions FOR SELECT TO anon, authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'alerts' AND policyname = 'Allow public read access to alerts') THEN
        CREATE POLICY "Allow public read access to alerts" ON public.alerts FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
