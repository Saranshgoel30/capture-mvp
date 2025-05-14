import { supabase } from './client';
import { PortfolioProject } from '../types';

// Rename function to match what's imported in index.ts
export const fetchPortfolioProjects = async (userId: string): Promise<PortfolioProject[]> => {
  // Alias to the existing function
  return fetchPortfolioItems(userId);
};

export const fetchPortfolioItems = async (userId: string): Promise<PortfolioProject[]> => {
  try {
    // Use profile_id instead of profileId to match the database column name
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
    
    // Transform the data to match our frontend types
    const portfolioItems: PortfolioProject[] = data?.map(item => ({
      id: item.id,
      userId: userId,
      title: item.title,
      type: item.type,
      role: item.role || '',
      date: item.date || '',
      description: item.description || '',
      collaborators: item.collaborators || [],
      thumbnail: item.media_url,
      mediaType: (item.media_type || 'link') as 'image' | 'video' | 'link',
      createdAt: item.created_at ? new Date(item.created_at).getTime() : Date.now(),
      // Keep original fields for compatibility
      profile_id: item.profile_id,
      media_url: item.media_url,
      media_type: item.media_type,
      created_at: item.created_at
    })) || [];
    
    return portfolioItems;
  } catch (error) {
    console.error('Exception fetching portfolio items:', error);
    return [];
  }
};

// Rename function to match what's imported in index.ts
export const addPortfolioProject = async (item: {
  profileId: string;
  title: string;
  type: string;
  role?: string;
  date?: string;
  description?: string;
  collaborators?: string[];
  mediaType: 'image' | 'video' | 'link';
  thumbnail: string;
}): Promise<string | null> => {
  // Alias to the existing function
  return addPortfolioItem(item);
};

export const addPortfolioItem = async (item: {
  profileId: string;
  title: string;
  type: string;
  role?: string;
  date?: string;
  description?: string;
  collaborators?: string[];
  mediaType: 'image' | 'video' | 'link';
  thumbnail: string;
}): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        profile_id: item.profileId,
        title: item.title,
        type: item.type,
        role: item.role || null,
        date: item.date || null,
        description: item.description || null,
        collaborators: item.collaborators || [],
        media_type: item.mediaType,
        media_url: item.thumbnail
      })
      .select()
      .maybeSingle();
      
    if (error) {
      console.error('Error adding portfolio item:', error);
      throw new Error(error.message);
    }
    
    return data?.id || null;
  } catch (error) {
    console.error('Exception adding portfolio item:', error);
    throw error;
  }
};

// Add this function to match what's imported in index.ts
export const getPortfolioItemDetails = async (itemId: string): Promise<PortfolioProject | null> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('id', itemId)
      .maybeSingle();
      
    if (error || !data) {
      console.error('Error fetching portfolio item details:', error);
      return null;
    }
    
    // Transform to match our frontend types
    const portfolioItem: PortfolioProject = {
      id: data.id,
      userId: data.profile_id,
      title: data.title,
      type: data.type,
      role: data.role || '',
      date: data.date || '',
      description: data.description || '',
      collaborators: data.collaborators || [],
      thumbnail: data.media_url,
      mediaType: (data.media_type || 'link') as 'image' | 'video' | 'link',
      createdAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
      // Keep original fields for compatibility
      profile_id: data.profile_id,
      media_url: data.media_url,
      media_type: data.media_type,
      created_at: data.created_at
    };
    
    return portfolioItem;
  } catch (error) {
    console.error('Exception fetching portfolio item details:', error);
    return null;
  }
};

export const deletePortfolioItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId);
      
    if (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception deleting portfolio item:', error);
    return false;
  }
};
