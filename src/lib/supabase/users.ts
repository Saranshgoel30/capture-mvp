
import { supabase } from './client';

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user;
};

export const fetchUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data;
};

export const fetchNotifications = async (userId: string) => {
  // In a real app, you would have a notifications table
  // For now, we'll simulate notifications based on applications
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
    throw error;
  }

  // Transform applications into notifications
  return applications.map((app: any) => {
    const isOwner = app.projects.owner_id === userId;
    return {
      id: app.id,
      type: isOwner ? 'application_received' : 'application_status',
      title: isOwner ? 'New application received' : `Application ${app.status}`,
      message: isOwner 
        ? `Someone applied to your project "${app.projects.title}"`
        : `Your application for "${app.projects.title}" is ${app.status}`,
      read: false,
      createdAt: new Date(app.created_at).getTime()
    };
  });
};
