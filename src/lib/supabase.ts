
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
  // First, let's fetch all projects
  const { data: projectsData, error: projectsError } = await supabase
    .from('projects')
    .select('*');

  if (projectsError) {
    console.error('Error fetching projects:', projectsError);
    throw projectsError;
  }

  if (!projectsData || projectsData.length === 0) {
    return [];
  }

  // Now fetch profile data for each project owner
  const ownerIds = projectsData.map(project => project.owner_id);
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .in('id', ownerIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    // Continue without profile data rather than failing
  }

  // Create a lookup map for profiles
  const profilesMap = new Map();
  if (profilesData) {
    profilesData.forEach(profile => {
      profilesMap.set(profile.id, profile);
    });
  }

  // Transform data to match the expected Project format
  return projectsData.map((project) => {
    const profile = profilesMap.get(project.owner_id);
    
    // Determine project type from title or default to "Other"
    // This is a workaround since 'type' doesn't exist in the database schema
    const projectType = determineProjectType(project.title);
    
    return {
      id: project.id,
      title: project.title,
      // Use a derived or default type since it's not in the database
      type: projectType,
      description: project.description,
      location: project.location,
      // Create a timeline string from the deadline
      timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
      rolesNeeded: project.required_roles || [],
      postedBy: profile?.full_name || 'Anonymous',
      postedById: project.owner_id,
      postedByAvatar: profile?.avatar_url,
      deadline: new Date(project.deadline).toLocaleDateString(),
      // Default to 0 if applicants count is not available
      applicants: 0,
      createdAt: new Date(project.created_at).getTime()
    };
  });
};

// Function to fetch a single project by ID
export const fetchProjectById = async (projectId: string) => {
  // Fetch the project data
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (projectError) {
    console.error('Error fetching project:', projectError);
    throw projectError;
  }

  // Fetch the owner's profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', project.owner_id)
    .single();

  if (profileError) {
    console.error('Error fetching project owner profile:', profileError);
    // Continue without profile data
  }

  // Determine project type from title or default to "Other"
  const projectType = determineProjectType(project.title);

  // Transform data to match the expected Project format
  return {
    id: project.id,
    title: project.title,
    type: projectType,
    description: project.description,
    location: project.location,
    timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
    rolesNeeded: project.required_roles || [],
    postedBy: profile?.full_name || 'Anonymous',
    postedById: project.owner_id,
    postedByAvatar: profile?.avatar_url,
    deadline: new Date(project.deadline).toLocaleDateString(),
    applicants: 0, // Default value since we don't have this field yet
    createdAt: new Date(project.created_at).getTime()
  };
};

// Helper function to determine project type based on title or other data
// Since 'type' doesn't exist in our database schema, we're deriving it
function determineProjectType(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('film') || titleLower.includes('movie')) {
    return 'Short Film';
  } else if (titleLower.includes('music') || titleLower.includes('video')) {
    return 'Music Video';
  } else if (titleLower.includes('photo') || titleLower.includes('shoot')) {
    return 'Photography';
  } else if (titleLower.includes('podcast')) {
    return 'Podcast';
  } else if (titleLower.includes('commercial') || titleLower.includes('marketing')) {
    return 'Marketing';
  } else if (titleLower.includes('documentary')) {
    return 'Documentary';
  } else {
    return 'Other';
  }
}

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
