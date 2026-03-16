-- =============================================
-- 🔐 COMPLETE SETUP SCRIPT FOR NOVA STORE
-- Run this in Supabase SQL Editor
-- =============================================

-- Step 1: Update the profiles table to ensure all columns exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';

-- Step 2: Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert the profile
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'customer',
    TIMEZONE('utc', NOW()),
    TIMEZONE('utc', NOW())
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- If profile already exists, update it
  UPDATE public.profiles 
  SET email = NEW.email,
      full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.full_name, split_part(NEW.email, '@', 1))
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================
-- 🌐 ONLINE PRESENCE TABLE
-- =============================================

-- Create the online_presence table
CREATE TABLE IF NOT EXISTS public.online_presence (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    page_url TEXT,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_online_presence_user_id ON public.online_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_online_presence_last_seen ON public.online_presence(last_seen);

-- Enable RLS
ALTER TABLE public.online_presence ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can insert presence" ON public.online_presence;
DROP POLICY IF EXISTS "Anyone can update presence" ON public.online_presence;
DROP POLICY IF EXISTS "Admins can view all presence" ON public.online_presence;

-- Create new policies
CREATE POLICY "Anyone can insert presence" ON public.online_presence FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update presence" ON public.online_presence FOR UPDATE USING (true);
CREATE POLICY "Admins can view all presence" ON public.online_presence FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- 👤 MAKE YOUR ACCOUNT ADMIN
-- After signing up on the website, run this:
-- =============================================

-- Update the profile to be admin (replace with your email)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'piohio309j@gmail.com';

-- If the profile doesn't exist yet, create it manually after signup:
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES ('USER_ID_FROM_AUTH', 'piohio309j@gmail.com', 'Hassan', 'admin');

-- Verify admin was set
SELECT id, email, full_name, role FROM public.profiles 
WHERE email = 'piohio309j@gmail.com';

-- =============================================
-- ✅ DONE! 
-- 1. Sign up at /signup with your email
-- 2. Run the UPDATE query above to make yourself admin
-- 3. Go to /admin to access the dashboard
-- =============================================
