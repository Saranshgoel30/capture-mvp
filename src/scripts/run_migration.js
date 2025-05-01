// Script to run the SQL migration files to fix the RLS policies for applications and portfolio_items tables
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file if available
require('dotenv').config();

// Get Supabase URL and key from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL and key must be provided as environment variables');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    // Read the applications SQL migration file
    const applicationsMigrationPath = path.join(__dirname, '..', 'migrations', 'fix_applications_rls.sql');
    const applicationsSQL = fs.readFileSync(applicationsMigrationPath, 'utf8');

    console.log('Running migration to fix applications RLS policies and add unique constraint...');

    // Execute the applications SQL directly using the Supabase client
    let { error } = await supabase.rpc('pgmigrate', { query: applicationsSQL });

    if (error) {
      console.error('Error running applications migration:', error);
      process.exit(1);
    }

    console.log('Applications migration completed successfully!');
    
    // Read the portfolio items SQL migration file
    const portfolioMigrationPath = path.join(__dirname, '..', 'migrations', 'fix_portfolio_items_rls.sql');
    const portfolioSQL = fs.readFileSync(portfolioMigrationPath, 'utf8');

    console.log('Running migration to fix portfolio_items RLS policies...');

    // Execute the portfolio items SQL directly using the Supabase client
    ({ error } = await supabase.rpc('pgmigrate', { query: portfolioSQL }));

    if (error) {
      console.error('Error running portfolio items migration:', error);
      process.exit(1);
    }

    console.log('Portfolio items migration completed successfully!');
    console.log('Fixed RLS policies for applications and portfolio_items tables.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

runMigration();