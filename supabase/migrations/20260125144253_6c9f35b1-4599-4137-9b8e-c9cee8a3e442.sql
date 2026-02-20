-- Add image_position column to store the focal point for image cropping
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center' NOT NULL;