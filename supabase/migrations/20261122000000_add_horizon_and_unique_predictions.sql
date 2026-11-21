-- ============================================================
-- DengueWatch AI — Add Forecast Horizon & Uniqueness Constraints
-- ============================================================

-- 1. Add horizon_weeks (2, 3, or 4 weeks) to risk_predictions
ALTER TABLE public.risk_predictions
  ADD COLUMN IF NOT EXISTS horizon_weeks INTEGER
  CHECK (horizon_weeks IN (2, 3, 4));

-- Backfill existing rows (if any) based on week difference, defaulting to 2
UPDATE public.risk_predictions
SET horizon_weeks = GREATEST(2, LEAST(4, ROUND((target_week_start - prediction_date) / 7.0)::INTEGER))
WHERE horizon_weeks IS NULL;

ALTER TABLE public.risk_predictions
  ALTER COLUMN horizon_weeks SET NOT NULL;

-- 2. Prevent duplicate predictions for the same ward, date, and horizon
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_risk_predictions_ward_pred_horizon'
  ) THEN
    ALTER TABLE public.risk_predictions
      ADD CONSTRAINT uq_risk_predictions_ward_pred_horizon
      UNIQUE (ward_id, prediction_date, horizon_weeks);
  END IF;
END $$;

-- 3. Add logical date & temperature integrity checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_risk_predictions_week_order'
  ) THEN
    ALTER TABLE public.risk_predictions
      ADD CONSTRAINT chk_risk_predictions_week_order
      CHECK (target_week_end >= target_week_start);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_weather_temp_order'
  ) THEN
    ALTER TABLE public.weather_data
      ADD CONSTRAINT chk_weather_temp_order
      CHECK (temperature_max_c >= temperature_min_c);
  END IF;
END $$;

-- 4. Index for fast horizon filtering in GET /api/overview and predictions
CREATE INDEX IF NOT EXISTS idx_risk_predictions_horizon_date
  ON public.risk_predictions (horizon_weeks, prediction_date DESC);
