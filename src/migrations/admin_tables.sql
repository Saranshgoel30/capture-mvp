-- Create feedback table for user feedback management
CREATE TABLE IF NOT EXISTS feedback (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create activity logs table for tracking user actions
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create function to delete user data (for admin use)
CREATE OR REPLACE FUNCTION delete_user_data(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete user's projects
  DELETE FROM projects WHERE owner_id = user_id;
  
  -- Delete user's applications
  DELETE FROM applications WHERE applicant_id = user_id;
  
  -- Delete user's feedback
  DELETE FROM feedback WHERE user_id = user_id;
  
  -- Delete user's activity logs
  DELETE FROM activity_logs WHERE user_id = user_id;
  
  -- Delete user's profile
  DELETE FROM profiles WHERE id = user_id;
  
  -- Note: The actual auth.users deletion should be handled through Supabase admin API
END;
$$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_type ON activity_logs(action_type);