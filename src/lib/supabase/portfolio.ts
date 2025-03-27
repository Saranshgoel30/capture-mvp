
import { supabase } from './client';

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
