CREATE TABLE public.health_days (
  day DATE NOT NULL PRIMARY KEY,
  weight_kg NUMERIC,
  waist_cm NUMERIC,
  steps INTEGER,
  active_energy_kcal INTEGER,
  exercise_minutes INTEGER,
  sleep_hours NUMERIC,
  resting_hr INTEGER,
  hrv_ms NUMERIC,
  vo2max NUMERIC,
  workout_minutes INTEGER,
  distance_km NUMERIC,
  source TEXT NOT NULL DEFAULT 'apple_health',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.health_days TO anon;
GRANT SELECT ON public.health_days TO authenticated;
GRANT ALL ON public.health_days TO service_role;

ALTER TABLE public.health_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Health days are publicly readable" ON public.health_days FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER health_days_updated_at BEFORE UPDATE ON public.health_days FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();