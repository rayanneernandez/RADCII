-- Fix security warning: Set search_path for the trigger function
DROP FUNCTION IF EXISTS public.update_incidents_updated_at() CASCADE;

CREATE OR REPLACE FUNCTION public.update_incidents_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_incidents_updated_at();