
import { supabase } from './client';

export const fetchAllUserProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching user profiles:', error);
      return [];
    }
    
    // Transform to match the expected UserProfile format
    return data.map(profile => ({
      id: profile.id,
      userId: profile.id,
      name: profile.full_name || 'Anonymous Creator',
      avatar: profile.avatar_url,
      bio: profile.bio || '',
      location: profile.city,
      roles: profile.roles || [],
      skills: profile.skills || [],
      stats: {
        projects: 0, // We could fetch this count from projects table in the future
      }
    }));
  } catch (error) {
    console.error('Exception fetching user profiles:', error);
    return [];
  }
};
