-- Create incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  description TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved')),
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can view their own incidents
CREATE POLICY "Users can view their own incidents"
ON public.incidents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own incidents
CREATE POLICY "Users can create their own incidents"
ON public.incidents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own incidents
CREATE POLICY "Users can update their own incidents"
ON public.incidents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own incidents
CREATE POLICY "Users can delete their own incidents"
ON public.incidents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_incidents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_incidents_updated_at
BEFORE UPDATE ON public.incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_incidents_updated_at();