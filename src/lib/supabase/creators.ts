
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
