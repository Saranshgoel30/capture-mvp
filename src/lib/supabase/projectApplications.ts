import { supabase } from './client';
import { ProjectApplication } from '@/lib/types';
import { fetchUserProfile } from './users';

// Fetch all applications for a specific project
export const fetchProjectApplications = async (projectId: string): Promise<ProjectApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching project applications:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Fetch applicant profiles separately since the join is causing type errors
    const enhancedApplications = await Promise.all(
      data.map(async (app) => {
        const profile = await fetchUserProfile(app.applicant_id);
        
        return {
          id: app.id,
          projectId: app.project_id,
          userId: app.applicant_id,
          status: app.status as 'pending' | 'approved' | 'rejected',
          coverLetter: app.cover_letter,
          createdAt: new Date(app.created_at).getTime(),
          applicant: profile ? {
            id: profile.id,
            name: profile.full_name || 'Unnamed User',
            avatar: profile.avatar_url,
            roles: profile.roles || []
          } : undefined,
          // Keep original fields for compatibility
          project_id: app.project_id,
          applicant_id: app.applicant_id,
          cover_letter: app.cover_letter,
          created_at: app.created_at
        };
      })
    );
    
    return enhancedApplications;
  } catch (error) {
    console.error('Exception fetching project applications:', error);
    return [];
  }
};

// Update application status
export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId);

    if (error) {
      console.error('Error updating application status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception updating application status:', error);
    return false;
  }
};

// Start a message thread with an applicant
export const startMessageWithApplicant = async (
  projectId: string,
  applicantId: string,
  message: string
): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('User not authenticated');
      return false;
    }
    
    const currentUserId = userData.user.id;
    
    // Make sure we're sending to the right person
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('project_id', projectId)
      .eq('applicant_id', applicantId)
      .single();
      
    if (appError || !application) {
      console.error('Application not found');
      return false;
    }
    
    // Get project info to include in the message
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('title')
      .eq('id', projectId)
      .single();
      
    if (projectError || !project) {
      console.error('Project not found');
      return false;
    }
    
    const initialMessage = message || `Hello! I'm reaching out about your application to the project "${project.title}".`;
    
    // Send the message
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUserId,
        receiver_id: applicantId,
        content: initialMessage,
      });
    
    if (messageError) {
      console.error('Error sending message:', messageError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception starting message with applicant:', error);
    return false;
  }
};
