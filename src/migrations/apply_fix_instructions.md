# How to Apply the Database Fixes in Supabase Dashboard

If you prefer to apply the fixes directly through the Supabase dashboard instead of using the Node.js script, follow these steps:

## Steps to Apply the Fixes

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.io/ and sign in
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" to create a new SQL query

### Fix for Applications Table

3. **Copy and Paste the Applications SQL Fix**
   - Copy the entire contents of the `fix_applications_rls.sql` file
   - Paste it into the SQL Editor

4. **Run the SQL Query**
   - Click the "Run" button to execute the SQL
   - You should see notices indicating the policies were updated successfully

### Fix for Portfolio Items Table

5. **Create a New Query**
   - Click "New Query" again to create another SQL query

6. **Copy and Paste the Portfolio Items SQL Fix**
   - Copy the entire contents of the `fix_portfolio_items_rls.sql` file
   - Paste it into the SQL Editor

7. **Run the SQL Query**
   - Click the "Run" button to execute the SQL
   - You should see notices indicating the portfolio_items policies were updated successfully

## Verifying the Fixes

After applying the fixes, you can verify they worked by:

1. **Check RLS Policies**
   - Go to "Authentication" > "Policies" in the Supabase dashboard
   - Look for the `applications` table and verify that the policies match those described in the SQL file
   - Look for the `portfolio_items` table and verify that the following policies exist:
     - "Users can create their own portfolio items"
     - "Users can update their own portfolio items"
     - "Users can delete their own portfolio items"
     - "Portfolio items are viewable by everyone"
   - Look for the `profiles` table and verify that the following policies exist:
     - "Users can insert their own profile"
     - "Users can update own profile"
     - "Profiles are viewable by everyone"

2. **Check Table Constraints**
   - Go to "Table Editor" > "applications"
   - Click on "Constraints"
   - Verify that there is a unique constraint on `project_id` and `applicant_id`

3. **Test Application Submission**
   - Try applying to a project in your application
   - Verify that you can apply once successfully
   - Verify that attempting to apply again is properly handled

4. **Test Portfolio Management**
   - Try adding a new portfolio item as a user
   - Try editing an existing portfolio item
   - Try deleting a portfolio item
   - Verify that all operations work correctly

If you encounter any issues, please refer to the README.md file for more detailed information about the fixes applied.