-- =============================================
-- 🔐 ADMIN SETUP SCRIPT
-- Run this AFTER creating your account on the website
-- =============================================

-- Step 1: Create your account first on the website (signup page)
-- Email: piohio309j@gmail.com
-- Password: Hassan309j

-- Step 2: After signing up, run this query to make yourself admin:

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'piohio309j@gmail.com';

-- Step 3: Verify the admin role was set:
SELECT id, email, full_name, role FROM public.profiles 
WHERE email = 'piohio309j@gmail.com';

-- =============================================
-- 🌐 ONLINE PRESENCE TABLE
-- Run this to enable online user tracking
-- =============================================

-- Create the online_presence table if it doesn't exist
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_online_presence_user_id ON public.online_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_online_presence_last_seen ON public.online_presence(last_seen);

-- Enable RLS
ALTER TABLE public.online_presence ENABLE ROW LEVEL SECURITY;

-- Create policies (drop existing first)
DROP POLICY IF EXISTS "Anyone can insert presence" ON public.online_presence;
DROP POLICY IF EXISTS "Anyone can update presence" ON public.online_presence;
DROP POLICY IF EXISTS "Admins can view all presence" ON public.online_presence;

CREATE POLICY "Anyone can insert presence" ON public.online_presence FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update presence" ON public.online_presence FOR UPDATE USING (true);
CREATE POLICY "Admins can view all presence" ON public.online_presence FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- ✅ DONE! 
-- After running this script:
-- 1. Go to /admin to access the admin dashboard
-- 2. You'll see online users in real-time
-- =============================================
