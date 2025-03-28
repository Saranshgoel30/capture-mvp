
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError);
      throw updateError;
    }

    return publicUrl;
  } catch (error) {
    console.error('Exception in uploadProfileImage:', error);
    throw error;
  }
};
