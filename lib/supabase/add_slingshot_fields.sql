-- Add Slingshot feature fields to trips table
-- Run this in Supabase SQL Editor after the main database.sql

-- Add columns for Slingshot metadata
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS is_slingshot_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS slingshot_metadata jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.trips.is_slingshot_generated IS 'True if this trip was generated via the Slingshot AI feature';
COMMENT ON COLUMN public.trips.slingshot_metadata IS 'Stores Slingshot questionnaire data, generation timestamp, and vibe explanation';

