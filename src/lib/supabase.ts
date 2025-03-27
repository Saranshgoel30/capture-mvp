
import { supabase } from '@/integrations/supabase/client';

export { supabase };

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

// Function to add a new project
export const addProject = async (projectData: any) => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('User not authenticated');
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      owner_id: userData.user.id,
      title: projectData.title,
      description: projectData.description,
      location: projectData.location,
      type: projectData.type,
      required_roles: projectData.roles || [],
      deadline: projectData.deadline
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding project:', error);
    throw error;
  }

  return data;
};

// Improved function to fetch projects with better error handling and consistent data format
export const fetchProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Transform data to match the expected Project format
  return data.map((project: any) => ({
    id: project.id,
    title: project.title,
    type: project.type || 'Other',
    description: project.description,
    location: project.location,
    timeline: project.timeline || `Until ${new Date(project.deadline).toLocaleDateString()}`,
    rolesNeeded: project.required_roles || [],
    postedBy: project.profiles?.full_name || 'Anonymous',
    postedById: project.owner_id,
    postedByAvatar: project.profiles?.avatar_url,
    deadline: new Date(project.deadline).toLocaleDateString(),
    applicants: project.applicants || 0,
    createdAt: new Date(project.created_at).getTime()
  }));
};

// Function to fetch a single project by ID
export const fetchProjectById = async (projectId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      profiles:owner_id (
        full_name,
        avatar_url
      )
    `)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    type: data.type || 'Other',
    description: data.description,
    location: data.location,
    timeline: data.timeline || `Until ${new Date(data.deadline).toLocaleDateString()}`,
    rolesNeeded: data.required_roles || [],
    postedBy: data.profiles?.full_name || 'Anonymous',
    postedById: data.owner_id,
    postedByAvatar: data.profiles?.avatar_url,
    deadline: new Date(data.deadline).toLocaleDateString(),
    applicants: data.applicants || 0,
    createdAt: new Date(data.created_at).getTime()
  };
};

// Function to add portfolio item
export const addPortfolioItem = async (userId: string, itemData: any) => {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert({
      profile_id: userId,
      title: itemData.title,
      type: itemData.type,
      description: itemData.description,
      media_url: itemData.mediaUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding portfolio item:', error);
    throw error;
  }

  return data;
};

// Function to apply for a project
export const applyForProject = async (projectId: string, userId: string, coverLetter: string) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      project_id: projectId,
      applicant_id: userId,
      cover_letter: coverLetter,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error applying for project:', error);
    throw error;
  }

  return data;
};

// Function to fetch user applications
export const fetchUserApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      projects:project_id (*)
    `)
    .eq('applicant_id', userId);

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }

  return data;
};

// Function to fetch notifications (simplified)
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
