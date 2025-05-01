-- Fix missing RLS policies for portfolio_items table

-- Check if the portfolio_items table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'portfolio_items') THEN
    -- First, ensure RLS is enabled on the table
    ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
    
    -- Drop any existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Users can create their own portfolio items" ON public.portfolio_items;
    DROP POLICY IF EXISTS "Users can update their own portfolio items" ON public.portfolio_items;
    DROP POLICY IF EXISTS "Users can delete their own portfolio items" ON public.portfolio_items;
    DROP POLICY IF EXISTS "Portfolio items are viewable by everyone" ON public.portfolio_items;
    
    -- Create policy for users to create their own portfolio items
    CREATE POLICY "Users can create their own portfolio items" 
      ON public.portfolio_items 
      FOR INSERT 
      WITH CHECK (auth.uid() = profile_id);
    
    -- Create policy for users to update their own portfolio items
    CREATE POLICY "Users can update their own portfolio items" 
      ON public.portfolio_items 
      FOR UPDATE 
      USING (auth.uid() = profile_id);
    
    -- Create policy for users to delete their own portfolio items
    CREATE POLICY "Users can delete their own portfolio items" 
      ON public.portfolio_items 
      FOR DELETE 
      USING (auth.uid() = profile_id);
    
    -- Create policy for portfolio items to be viewable by everyone
    CREATE POLICY "Portfolio items are viewable by everyone" 
      ON public.portfolio_items 
      FOR SELECT 
      USING (true);
    
    RAISE NOTICE 'Successfully updated RLS policies for portfolio_items table';
  ELSE
    RAISE NOTICE 'portfolio_items table does not exist, skipping migration';
  END IF;
END $$;

-- Verify profiles table has proper RLS policies
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    -- Ensure RLS is enabled on the profiles table
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    
    -- Ensure users can insert their own profiles (for new users)
    DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
    CREATE POLICY "Users can insert their own profile" 
      ON public.profiles 
      FOR INSERT 
      WITH CHECK (auth.uid() = id);
    
    -- Ensure users can update their own profiles
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile" 
      ON public.profiles 
      FOR UPDATE 
      USING (auth.uid() = id);
    
    -- Ensure profiles are publicly viewable
    DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
    CREATE POLICY "Profiles are viewable by everyone" 
      ON public.profiles 
      FOR SELECT 
      USING (true);
    
    RAISE NOTICE 'Successfully updated RLS policies for profiles table';
  ELSE
    RAISE NOTICE 'Profiles table does not exist, skipping migration';
  END IF;
END $$;