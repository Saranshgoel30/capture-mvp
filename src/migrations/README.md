# Database Migration: Fixes for Applications and Portfolio Items Tables

This migration addresses several issues with Supabase Row Level Security (RLS) policies for the `applications` and `portfolio_items` tables, and adds a unique constraint to prevent duplicate applications.

## Issues Fixed

1. **Infinite Recursion in RLS Policies**: The original RLS policy for application creation was causing an infinite recursion loop, which was preventing users from successfully applying to projects.

2. **Duplicate Applications**: Added a unique constraint on `(project_id, applicant_id)` to prevent users from submitting multiple applications to the same project at the database level.

3. **Missing Profile Policies**: Ensured proper RLS policies exist for the profiles table to allow users to update their own profiles.

4. **Missing Portfolio Items Policies**: Added proper RLS policies for the `portfolio_items` table to allow users to create, update, and delete their own portfolio items while making them viewable by everyone.

## How to Apply the Fix

### Option 1: Using the Migration Script

1. Make sure you have the required environment variables set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_SERVICE_ROLE_KEY` or `VITE_SUPABASE_ANON_KEY`

2. Run the migration script:
   ```bash
   node src/scripts/run_migration.js
   ```

### Option 2: Manual SQL Execution

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `fix_applications_rls.sql` into the editor and run the SQL script
4. Create a new query, paste the contents of `fix_portfolio_items_rls.sql` and run the SQL script

## Code Changes

The following code changes were also made to handle the unique constraint properly:

1. Updated `applyForProject` function in `projects.ts` to properly handle existing applications
2. Modified `handleApply` function in `Projects.tsx` to handle unique constraint violations

## Verification

After applying the fixes, users should be able to:
- Apply to projects without encountering infinite recursion errors
- Not be able to submit duplicate applications to the same project
- Update their profile information without issues
- Create, update, and delete their own portfolio items