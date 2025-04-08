
import { supabase } from './client';
import { v4 as uuidv4 } from 'uuid';

// Helper function to ensure buckets exist using the admin edge function
const ensureBucketExists = async (bucketName: string) => {
  try {
    console.log(`Ensuring bucket ${bucketName} exists...`);
    
    // Invoke the edge function to create buckets
    const { data, error } = await supabase.functions.invoke('init_storage_buckets');
    
    if (error) {
      console.error('Error invoking init_storage_buckets function:', error);
      throw new Error(`Could not initialize storage buckets. Please try again or contact support if the issue persists. (${error.message})`);
    }
    
    if (!data || !data.results) {
      console.error('No results returned from init_storage_buckets function');
      throw new Error('Failed to initialize storage buckets - no results returned');
    }
    
    // Check if our specific bucket was created/exists
    const bucketResult = data.results.find((r: any) => r.id === bucketName);
    
    if (!bucketResult) {
      console.error(`Bucket ${bucketName} not found in results`);
      throw new Error(`Bucket ${bucketName} was not initialized properly`);
    }
    
    if (bucketResult.status === 'error') {
      console.error(`Error with bucket ${bucketName}:`, bucketResult.message);
      throw new Error(`Error initializing bucket ${bucketName}: ${bucketResult.message}`);
    }
    
    console.log(`Bucket ${bucketName} is ready (status: ${bucketResult.status})`);
    return true;
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId: string, file: File) => {
  try {
    // Check file size - mobile uploads can be very large
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 5MB');
    }

    // Log file details for debugging
    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });

    // Ensure the avatars bucket exists before uploading
    await ensureBucketExists('avatars');

    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log('Uploading to path:', filePath);

    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing files with the same name
        contentType: file.type // Explicitly set content type
      });

    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }

    console.log('Upload successful, getting public URL');

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    console.log('Public URL obtained:', publicUrl);

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError);
      throw updateError;
    }

    console.log('Profile updated successfully with new avatar');

    // Return the public URL with a cache-busting parameter
    // This ensures the browser doesn't show the old image due to caching
    return `${publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error('Exception in uploadProfileImage:', error);
    throw error;
  }
};

export const uploadPortfolioMedia = async (userId: string, file: File) => {
  try {
    // Check file size - mobile uploads can be very large
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB for portfolio files
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must be less than 10MB');
    }
    
    // Log file details for debugging
    console.log('Uploading portfolio media:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`
    });
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Determine media type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const bucketName = isImage ? 'portfolio_images' : isVideo ? 'portfolio_videos' : 'portfolio_files';

    // Ensure the bucket exists
    await ensureBucketExists(bucketName);

    console.log(`Uploading to ${bucketName}/${filePath}`);

    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing files with the same name
        contentType: file.type // Explicitly set content type
      });

    if (error) {
      console.error(`Error uploading to ${bucketName}:`, error);
      throw error;
    }

    console.log('Portfolio media uploaded successfully');

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('Public URL obtained:', publicUrl);

    // Return with cache-busting parameter
    return `${publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error('Exception in uploadPortfolioMedia:', error);
    throw error;
  }
};
