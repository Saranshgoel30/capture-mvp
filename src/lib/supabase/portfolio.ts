import { supabase } from './client';
import { PortfolioProject } from '../types';

// Function to add portfolio item
export const addPortfolioItem = async (userId: string, itemData: any) => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        profile_id: userId,
        title: itemData.title,
        type: itemData.type,
        description: itemData.description,
        media_url: itemData.mediaUrl || null,
        media_type: itemData.mediaType || 'link',
        role: itemData.role || '',
        date: itemData.date || '',
        collaborators: itemData.collaborators || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in addPortfolioItem:', error);
    throw error;
  }
};

// Function to fetch portfolio items for a user
export const fetchPortfolioItems = async (userId: string): Promise<PortfolioProject[]> => {
  try {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
    
    // Convert Supabase data to our app's format with proper type casting
    return data.map(item => ({
      id: item.id,
      userId: userId,
      title: item.title,
      type: item.type,
      thumbnail: item.media_url,
      // Ensure mediaType is one of the allowed values, defaulting to 'link' if not
      mediaType: (item.media_type === 'image' || item.media_type === 'video') 
        ? item.media_type as 'image' | 'video' 
        : 'link',
      role: item.role || 'Creator',
      date: item.date || new Date(item.created_at).toLocaleDateString(),
      collaborators: item.collaborators || [],
      description: item.description || '',
      createdAt: new Date(item.created_at).getTime(),
      // Keep original fields for compatibility
      profile_id: item.profile_id,
      media_url: item.media_url,
      media_type: item.media_type,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in fetchPortfolioItems:', error);
    return [];
  }
};

// Function to delete a portfolio item
export const deletePortfolioItem = async (userId: string, itemId: string) => {
  try {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId)
      .eq('profile_id', userId);
      
    if (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deletePortfolioItem:', error);
    throw error;
  }
};
