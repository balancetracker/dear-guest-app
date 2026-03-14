
-- Add missing columns to settings table (re-run since previous failed mid-way)
ALTER TABLE public.settings
ADD COLUMN IF NOT EXISTS couple_names_km text,
ADD COLUMN IF NOT EXISTS wedding_date_km text,
ADD COLUMN IF NOT EXISTS wedding_time_km text,
ADD COLUMN IF NOT EXISTS venue_km text,
ADD COLUMN IF NOT EXISTS wedding_date_time text,
ADD COLUMN IF NOT EXISTS calendar_url text,
ADD COLUMN IF NOT EXISTS map_lat text,
ADD COLUMN IF NOT EXISTS map_lng text,
ADD COLUMN IF NOT EXISTS map_embed_url text,
ADD COLUMN IF NOT EXISTS contact_telegram text,
ADD COLUMN IF NOT EXISTS contact_facebook text,
ADD COLUMN IF NOT EXISTS music_file text,
ADD COLUMN IF NOT EXISTS wedding_description text,
ADD COLUMN IF NOT EXISTS wedding_description_km text;

-- Enable realtime on remaining tables (guests already added)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE wishes;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE photos;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE settings;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
