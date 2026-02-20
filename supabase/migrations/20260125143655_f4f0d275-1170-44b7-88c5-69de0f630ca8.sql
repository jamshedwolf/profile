-- Create the project-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images (public bucket)
CREATE POLICY "Anyone can view project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload project images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-images' AND auth.uid() IS NOT NULL);

-- Allow users to update their own images
CREATE POLICY "Users can update their own project images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own project images"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);