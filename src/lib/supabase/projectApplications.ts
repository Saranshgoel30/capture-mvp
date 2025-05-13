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

    // Fetch applicant profiles separately to avoid relationship errors
    const enhancedApplications = await Promise.all(
      data.map(async (app) => {
        const profile = await fetchUserProfile(app.applicant_id);
        
        return {
          id: app.id,
          projectId: app.project_id,
          userId: app.applicant_id,
          status: app.status as 'pending' | 'approved' | 'rejected',
          coverLetter: app.cover_letter,
          selectedRole: app.selected_role || '',
          createdAt: new Date(app.created_at).getTime(),
          applicant: profile ? {
            id: profile.id,
            name: profile.full_name || 'Unnamed User',
            avatar: profile.avatar_url,
            roles: profile.roles || []
          } : undefined,
          // Keep original fields and add legacy compatibility
          project_id: app.project_id,
          applicant_id: app.applicant_id,
          cover_letter: app.cover_letter,
          selected_role: app.selected_role || '',
          created_at: app.created_at,
          applicant_profile: profile ? {
            id: profile.id,
            full_name: profile.full_name || 'Unnamed User',
            avatar_url: profile.avatar_url,
            roles: profile.roles || []
          } : undefined
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
    // Get the current user
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return false;
    
    // Send message to the applicant
    const { error } = await supabase.from('messages').insert({
      sender_id: userData.user.id,
      receiver_id: applicantId,
      content: message
    });
    
    if (error) {
      console.error('Error sending message to applicant:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception starting message with applicant:', error);
    return false;
  }
};
