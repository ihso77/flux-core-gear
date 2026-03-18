
-- Create profiles table first
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Anyone can read profiles" ON public.profiles FOR SELECT USING (true);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Users can insert own profile
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Online presence table
CREATE TABLE public.online_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  page_url TEXT DEFAULT '/'
);

ALTER TABLE public.online_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read online_presence" ON public.online_presence FOR SELECT USING (true);
CREATE POLICY "Anyone can insert online_presence" ON public.online_presence FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update online_presence" ON public.online_presence FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete online_presence" ON public.online_presence FOR DELETE USING (true);

-- Enable realtime for online_presence
ALTER PUBLICATION supabase_realtime ADD TABLE public.online_presence;
