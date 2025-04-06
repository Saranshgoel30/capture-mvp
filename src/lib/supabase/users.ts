import { supabase } from './client';

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user;
};

export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception fetching user profile:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Exception updating user profile:', error);
    throw error;
  }
};

// Rename this function to be clearer about its source and purpose
export const fetchNotifications = async (userId: string) => {
  // In a real app, you would have a notifications table
  // For now, we'll simulate notifications based on applications
  try {
    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        projects:project_id (
          title,
          owner_id
        )
      `)
      .or(`applicant_id.eq.${userId},projects.owner_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    if (!applications || applications.length === 0) {
      return [];
    }

    // Transform applications into notifications
    return applications.map((app: any) => {
      const isOwner = app.projects?.owner_id === userId;
      return {
        id: app.id,
        type: isOwner ? 'application_received' : 'application_status',
        title: isOwner ? 'New application received' : `Application ${app.status}`,
        message: isOwner 
          ? `Someone applied to your project "${app.projects?.title || 'Untitled'}"` 
          : `Your application for "${app.projects?.title || 'Untitled'}" is ${app.status || 'pending'}`,
        read: false,
        createdAt: app.created_at ? new Date(app.created_at).getTime() : Date.now()
      };
    });
  } catch (error) {
    console.error('Exception fetching notifications:', error);
    return [];
  }
};
