-- Fix RLS policies for projects table (drop insecure policies if they exist)
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;

-- Ensure correct policies exist (recreate if needed)
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- Create secure policies
CREATE POLICY "Anyone can view published projects" 
ON public.projects 
FOR SELECT 
USING (published = true);

CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Fix contact_messages table - add SELECT policy for admin only
-- First ensure RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Service role can read contact messages" ON public.contact_messages;

-- Allow anyone to insert (for contact form)
CREATE POLICY "Anyone can insert contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only service role (edge functions) can read messages
-- Regular users cannot select from this table
CREATE POLICY "Service role can manage contact messages" 
ON public.contact_messages 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);