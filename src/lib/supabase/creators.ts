
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
    
    // Transform to match the simplified UserProfile format for the creators page
    // This is intentionally not using the full UserProfile interface as we don't have all that data
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
      },
      // These fields are added to satisfy the UserProfile interface when used in FindCreators
      handle: profile.full_name?.toLowerCase().replace(/\s+/g, '.') || 'anonymous',
      contact: {
        email: '',
      },
      createdAt: Date.now()
    }));
  } catch (error) {
    console.error('Exception fetching user profiles:', error);
    return [];
  }
};
