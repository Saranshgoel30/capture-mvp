import { supabase } from './client';
import { UserProfile } from '@/lib/types';

export const fetchAllUserProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching user profiles:', error);
      return [];
    }
    
    // Transform to match the UserProfile interface
    return data.map(profile => ({
      id: profile.id,
      userId: profile.id,
      name: profile.full_name || 'Anonymous Creator',
      handle: profile.full_name?.toLowerCase().replace(/\s+/g, '.') || 'anonymous',
      avatar: profile.avatar_url,
      bio: profile.bio || '',
      location: profile.city,
      roles: profile.roles || [],
      skills: profile.skills || [],
      contact: {
        email: '',
        // Additional contact info could be added here in the future
      },
      stats: {
        followers: 0, // Placeholder for future implementation
        following: 0, // Placeholder for future implementation
        projects: 0, // We could fetch this count from projects table in the future
      },
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error('Exception fetching user profiles:', error);
    return [];
  }
};

// Add the fetchCreators function that FindCreators.tsx expects
export const fetchCreators = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching creators:', error);
      return [];
    }
    
    // Transform to match the Creator interface expected by FindCreators
    return (data || []).map(profile => ({
      id: profile.id,
      full_name: profile.full_name || 'Anonymous Creator',
      roles: profile.roles || [],
      skills: profile.skills || [],
      city: profile.city || '',
      bio: profile.bio || '',
      avatar_url: profile.avatar_url,
      portfolio_count: 0, // We could fetch this from portfolio_items table if needed
    }));
  } catch (error) {
    console.error('Exception fetching creators:', error);
    return [];
  }
};

export const fetchCurrentProjects = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('current_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching current projects:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching current projects:', error);
    return [];
  }
};

export const addCurrentProject = async (projectData: {
  userId: string;
  title: string;
  role: string;
  timeline: string;
  description: string;
  status?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('current_projects')
      .insert({
        user_id: projectData.userId,
        title: projectData.title,
        role: projectData.role,
        timeline: projectData.timeline,
        description: projectData.description,
        status: projectData.status || 'In Production'
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('Error adding current project:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception adding current project:', error);
    throw error;
  }
};
