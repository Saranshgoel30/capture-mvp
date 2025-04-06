
// Re-export everything from individual modules
export * from './client';
// Export users functions, but rename the fetchNotifications function
export { 
  getCurrentUser, 
  fetchUserProfile, 
  updateUserProfile,
  fetchNotifications as fetchUserNotificationsFromApplications 
} from './users';
export * from './projects';
export * from './storage';
export * from './portfolio';
export * from './creators';
export * from './projectApplications';
export * from './messages';
// Export the notifications module explicitly
export { 
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification
} from './notifications';

import { supabase } from './client';

// Function to initialize storage buckets if needed
export const initializeStorage = async () => {
  try {
    // Try to invoke the init_storage_buckets function to ensure all buckets exist
    const { data, error } = await supabase.functions.invoke('init_storage_buckets');
    
    if (error) {
      console.error('Error initializing storage buckets:', error);
      return false;
    }
    
    console.log('Storage buckets initialized:', data);
    return true;
  } catch (error) {
    console.error('Exception initializing storage buckets:', error);
    return false;
  }
};
