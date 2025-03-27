
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL = "https://mhfukgqkaijailpwpcdi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oZnVrZ3FrYWlqYWlscHdwY2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE2MzksImV4cCI6MjA1ODQ1NzYzOX0.qlpqn-yOrxJsxEhwr6ZALLCWa1tNHD7HM-acE5Fsfw8";

// Get the current URL for redirect logic
const getRedirectTo = () => {
  // For browser environments only
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/projects`;
  }
  return '/projects';
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce',
    detectSessionInUrl: true,
    redirectTo: getRedirectTo()
  }
});
