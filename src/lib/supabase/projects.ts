import { supabase } from './client';
import { Project, ProjectApplication } from '@/lib/types';

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

// Ensure the addProject function is exported (it already exists in the file)
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
    const transformedProjects: Project[] = projectsData.map((project) => {
      const profile = profilesMap.get(project.owner_id);
      
      // Determine project type from title or default to "Other"
      const projectType = determineProjectType(project.title);
      
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        deadline: new Date(project.deadline).toLocaleDateString(),
        requiredRoles: project.required_roles || [],
        ownerId: project.owner_id,
        createdAt: new Date(project.created_at).getTime(),
        type: projectType,
        timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
        rolesNeeded: project.required_roles || [],
        postedBy: profile?.full_name || 'Anonymous',
        postedById: project.owner_id,
        postedByAvatar: profile?.avatar_url,
        applicants: 0,
        // Keep original fields for compatibility
        owner_id: project.owner_id,
        required_roles: project.required_roles,
        created_at: project.created_at
      };
    });
    
    return transformedProjects;
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
    const transformedProject: Project = {
      id: project.id,
      title: project.title,
      description: project.description,
      location: project.location,
      deadline: new Date(project.deadline).toLocaleDateString(),
      requiredRoles: project.required_roles || [],
      ownerId: project.owner_id,
      createdAt: new Date(project.created_at).getTime(),
      type: projectType,
      timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
      rolesNeeded: project.required_roles || [],
      postedBy: profile?.full_name || 'Anonymous',
      postedById: project.owner_id,
      postedByAvatar: profile?.avatar_url,
      applicants: 0,
      // Keep original fields for compatibility
      owner_id: project.owner_id,
      required_roles: project.required_roles,
      created_at: project.created_at
    };
    
    return transformedProject;
  } catch (error) {
    console.error('Exception fetching project:', error);
    return null; // Return null to handle gracefully in the UI
  }
};

// Function to apply for a project
export const applyForProject = async (projectId: string, userId: string, coverLetter: string = '', selectedRole: string = ''): Promise<ProjectApplication> => {
  try {
    // Check if the user has already applied
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id, status, cover_letter, selected_role, created_at')
      .eq('project_id', projectId)
      .eq('applicant_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing application:', checkError);
      throw checkError;
    }

    // If the user has already applied, return the existing application
    if (existingApplication) {
      return {
        id: existingApplication.id,
        projectId,
        userId,
        status: existingApplication.status as 'pending' | 'approved' | 'rejected',
        coverLetter: existingApplication.cover_letter || '',
        selectedRole: existingApplication.selected_role || '',
        createdAt: new Date(existingApplication.created_at).getTime(),
        // Add database field names for compatibility
        project_id: projectId,
        applicant_id: userId,
        cover_letter: existingApplication.cover_letter || '',
        selected_role: existingApplication.selected_role || '',
        created_at: existingApplication.created_at
      };
    }

    // Otherwise, create a new application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        project_id: projectId,
        applicant_id: userId,
        cover_letter: coverLetter,
        selected_role: selectedRole,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Error applying for project:', error);
      throw error;
    }

    return {
      id: data.id,
      projectId: data.project_id,
      userId: data.applicant_id,
      status: data.status as 'pending' | 'approved' | 'rejected',
      coverLetter: data.cover_letter,
      selectedRole: data.selected_role,
      createdAt: new Date(data.created_at).getTime(),
      // Keep original fields for compatibility
      project_id: data.project_id,
      applicant_id: data.applicant_id,
      cover_letter: data.cover_letter,
      selected_role: data.selected_role,
      created_at: data.created_at
    };
  } catch (error) {
    console.error('Exception applying for project:', error);
    throw error;
  }
};

// Function to fetch user applications
export const fetchUserApplications = async (userId: string): Promise<ProjectApplication[]> => {
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

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(app => ({
      id: app.id,
      projectId: app.project_id,
      userId: app.applicant_id,
      status: app.status as 'pending' | 'approved' | 'rejected',
      coverLetter: app.cover_letter,
      selectedRole: app.selected_role,
      createdAt: new Date(app.created_at).getTime(),
      project: app.projects ? {
        id: app.projects.id,
        title: app.projects.title,
        description: app.projects.description,
        location: app.projects.location,
        deadline: new Date(app.projects.deadline).toLocaleDateString(),
        requiredRoles: app.projects.required_roles || [],
        ownerId: app.projects.owner_id,
        createdAt: new Date(app.projects.created_at).getTime(),
      } : undefined,
      // Keep original fields for compatibility
      project_id: app.project_id,
      applicant_id: app.applicant_id,
      cover_letter: app.cover_letter,
      selected_role: app.selected_role,
      created_at: app.created_at
    }));
  } catch (error) {
    console.error('Exception fetching applications:', error);
    return [];
  }
};
