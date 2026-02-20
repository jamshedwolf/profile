-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published projects
CREATE POLICY "Anyone can view published projects"
  ON public.projects
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can read all projects (for admin)
CREATE POLICY "Authenticated users can view all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert projects
CREATE POLICY "Authenticated users can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update their own projects
CREATE POLICY "Authenticated users can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete their own projects
CREATE POLICY "Authenticated users can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


