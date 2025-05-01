-- Fix infinite recursion in RLS policies and add unique constraint for applications table

-- First, let's check if the applications table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'applications') THEN
    -- 1. Add a unique constraint to prevent duplicate applications
    -- This ensures a user can only apply once to a project
    BEGIN
      ALTER TABLE public.applications ADD CONSTRAINT unique_project_applicant UNIQUE (project_id, applicant_id);
      RAISE NOTICE 'Added unique constraint on project_id and applicant_id';
    EXCEPTION WHEN duplicate_table THEN
      RAISE NOTICE 'Unique constraint already exists';
    END;
    
    -- 2. Drop any existing problematic RLS policies that might be causing infinite recursion
    DROP POLICY IF EXISTS "Users can create applications" ON public.applications;
    
    -- 3. Create a new, simplified policy for application creation
    -- This policy allows users to create applications without the problematic EXISTS clause
    CREATE POLICY "Users can create applications" 
      ON public.applications 
      FOR INSERT 
      WITH CHECK (auth.uid() = applicant_id);
    
    -- 4. Ensure other necessary policies exist
    -- Policy for users to view their own applications
    DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
    CREATE POLICY "Users can view their own applications" 
      ON public.applications 
      FOR SELECT 
      USING (auth.uid() = applicant_id);
    
    -- Policy for project owners to view applications for their projects
    DROP POLICY IF EXISTS "Project owners can view applications" ON public.applications;
    CREATE POLICY "Project owners can view applications" 
      ON public.applications 
      FOR SELECT 
      USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = applications.project_id 
        AND projects.owner_id = auth.uid()
      ));
    
    -- Policy for project owners to update application status
    DROP POLICY IF EXISTS "Project owners can update applications" ON public.applications;
    CREATE POLICY "Project owners can update applications" 
      ON public.applications 
      FOR UPDATE 
      USING (EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = applications.project_id 
        AND projects.owner_id = auth.uid()
      ));
    
    RAISE NOTICE 'Successfully updated RLS policies for applications table';
  ELSE
    RAISE NOTICE 'Applications table does not exist, skipping migration';
  END IF;
END $$;

-- Check if profiles table exists and ensure proper RLS policies
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
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