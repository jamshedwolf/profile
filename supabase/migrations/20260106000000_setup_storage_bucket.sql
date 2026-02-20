-- Storage bucket setup instructions
-- Note: Storage buckets cannot be created via SQL migrations
-- They must be created through the Supabase Dashboard or Storage API

-- To set up the storage bucket:
-- 1. Go to your Supabase Dashboard
-- 2. Navigate to Storage section
-- 3. Click "Create a new bucket"
-- 4. Name: project-images
-- 5. Make it Public (or configure RLS policies)
-- 6. Save

-- Storage policies should be set up as follows:
-- For authenticated users to upload:
--   - INSERT policy: authenticated users can insert
--   - SELECT policy: authenticated users can select
--   - UPDATE policy: authenticated users can update their own files
--   - DELETE policy: authenticated users can delete their own files

-- Example policy (create via Dashboard or Storage API):
-- Policy name: "Authenticated users can upload"
-- Policy definition:
--   (bucket_id = 'project-images'::text) AND (auth.role() = 'authenticated'::text)
--   For INSERT operations

-- Policy name: "Users can read their own files"
-- Policy definition:
--   (bucket_id = 'project-images'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
--   For SELECT operations

-- Policy name: "Users can update their own files"
-- Policy definition:
--   (bucket_id = 'project-images'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
--   For UPDATE operations

-- Policy name: "Users can delete their own files"
-- Policy definition:
--   (bucket_id = 'project-images'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)
--   For DELETE operations



