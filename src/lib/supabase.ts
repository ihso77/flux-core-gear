import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lipthpnciloarvfwfmfe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpcHRocG5jaWxvYXJ2ZndmbWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTQ1NzUsImV4cCI6MjA4ODczMDU3NX0.NtYuldnqUin0Zzw7zNDekB_wHiyCiEOFdHYwOejw-3E';

// Custom cookie-based storage adapter for better session persistence
const cookieStorage = {
  getItem: (key: string): string | null => {
    // Try localStorage first (faster)
    try {
      const localValue = localStorage.getItem(key);
      if (localValue) return localValue;
    } catch (e) {
      // localStorage not available
    }
    
    // Fall back to cookies
    const cookies = document.cookie.split(';');
    const cookie = cookies.find(c => c.trim().startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1].trim()) : null;
  },
  setItem: (key: string, value: string): void => {
    // Save to localStorage
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // localStorage not available
    }
    
    // Also save to cookie for cross-tab persistence (expires in 1 year)
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    // Remove from localStorage
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // localStorage not available
    }
    
    // Remove cookie
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

// Configure Supabase with persistent session using cookies
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? cookieStorage : undefined,
    storageKey: 'nova-auth-token',
    flowType: 'pkce',
  },
});

// Types
export interface Profile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  preferred_platform?: string;
  favorite_games?: string[];
  gaming_experience?: string;
  newsletter_subscribed?: boolean;
  email_notifications?: boolean;
  role?: 'customer' | 'admin' | 'moderator';
  is_verified?: boolean;
  total_orders?: number;
  total_spent?: number;
  loyalty_points?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}
