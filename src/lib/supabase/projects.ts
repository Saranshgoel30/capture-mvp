import { supabase } from './client';
import { Project } from '@/lib/types';

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

// Function to add a new project
export const addProject = async (projectData: any) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error('User not authenticated');
    
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
  } catch (error) {
    console.error('Exception adding project:', error);
    throw error;
  }
};

// Improved function to fetch projects with better error handling and consistent data format
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    // Get current date for filtering expired projects
    const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // Fetch all projects that have not expired (deadline >= current date)
    const { data: projectsData, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .gte('deadline', currentDate); // Only fetch projects with deadlines >= today

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return [];
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
        if (profile && profile.id) {
          profilesMap.set(profile.id, profile);
        }
      });
    }

    // Transform data to match the expected Project format
    return projectsData.map((project) => {
      const profile = profilesMap.get(project.owner_id);
      
      // Determine project type from title or default to "Other"
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
  } catch (error) {
    console.error('Exception fetching projects:', error);
    return [];
  }
};

// Function to fetch a single project by ID
export const fetchProjectById = async (projectId: string): Promise<Project | null> => {
  try {
    // Fetch the project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (projectError || !project) {
      console.error('Error fetching project:', projectError);
      return null;
    }

    // Fetch the owner's profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', project.owner_id)
      .maybeSingle();

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
  } catch (error) {
    console.error('Exception fetching project:', error);
    return null; // Return null to handle gracefully in the UI
  }
};

// Function to apply for a project
export const applyForProject = async (projectId: string, userId: string, coverLetter: string = '') => {
  try {
    // Check if the user has already applied
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('project_id', projectId)
      .eq('applicant_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing application:', checkError);
      throw checkError;
    }

    // If the user has already applied, return the existing application
    if (existingApplication) {
      return existingApplication;
    }

    // Otherwise, create a new application
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
  } catch (error) {
    console.error('Exception applying for project:', error);
    throw error;
  }
};

// Function to fetch user applications
export const fetchUserApplications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        projects:project_id (*)
      `)
      .eq('applicant_id', userId);

    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Exception fetching applications:', error);
    return [];
  }
};
