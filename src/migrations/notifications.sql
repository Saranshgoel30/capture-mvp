
-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id TEXT,
  related_type TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for application status triggers
CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Add trigger function for application created
CREATE OR REPLACE FUNCTION public.handle_new_application()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the project owner
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_id,
    related_type,
    read
  )
  SELECT
    projects.owner_id,
    'application',
    'New Application Received',
    'Someone has applied to your project.',
    NEW.project_id,
    'project',
    false
  FROM
    public.projects
  WHERE
    projects.id = NEW.project_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for new applications
DROP TRIGGER IF EXISTS on_application_created ON public.applications;
CREATE TRIGGER on_application_created
  AFTER INSERT ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_application();

-- Add trigger function for application status changes
CREATE OR REPLACE FUNCTION public.handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    -- Notify the applicant
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      related_id,
      related_type,
      read
    )
    SELECT
      NEW.applicant_id,
      'application_status',
      CASE
        WHEN NEW.status = 'approved' THEN 'Application Approved'
        WHEN NEW.status = 'rejected' THEN 'Application Rejected'
        ELSE 'Application Status Changed'
      END,
      CASE
        WHEN NEW.status = 'approved' THEN 'Your application has been approved! Check your messages for next steps.'
        WHEN NEW.status = 'rejected' THEN 'Your application has not been selected for this project.'
        ELSE 'The status of your application has changed.'
      END,
      NEW.project_id,
      'project',
      false;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for application status changes
DROP TRIGGER IF EXISTS on_application_status_changed ON public.applications;
CREATE TRIGGER on_application_status_changed
  AFTER UPDATE OF status ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_application_status_change();

-- Add trigger function for new messages
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify the message recipient
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    message,
    related_id,
    related_type,
    read
  )
  VALUES (
    NEW.receiver_id,
    'message',
    'New Message',
    substring(NEW.content from 1 for 100) || CASE WHEN length(NEW.content) > 100 THEN '...' ELSE '' END,
    NEW.sender_id,
    'message',
    false
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for new messages
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_message();
