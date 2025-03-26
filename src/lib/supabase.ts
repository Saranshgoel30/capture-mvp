
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

// Function to fetch projects from Supabase
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
