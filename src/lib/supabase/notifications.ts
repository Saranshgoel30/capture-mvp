
import { supabase } from './client';

/**
 * Fetches notifications for a user
 * 
 * @param userId The user ID to fetch notifications for
 * @returns An array of notifications
 */
export const fetchNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching notifications:', error);
    return [];
  }
};

/**
 * Marks a notification as read
 * 
 * @param notificationId The ID of the notification to mark as read
 * @returns True if the operation was successful, false otherwise
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);
      
    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception marking notification as read:', error);
    return false;
  }
};

/**
 * Marks all notifications for a user as read
 * 
 * @param userId The user ID to mark all notifications as read for
 * @returns True if the operation was successful, false otherwise
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);
      
    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception marking all notifications as read:', error);
    return false;
  }
};

/**
 * Creates a new notification for a user
 * 
 * @param userId The user ID to create the notification for
 * @param type The type of notification
 * @param title The notification title
 * @param message The notification message
 * @param relatedType Optional related entity type
 * @param relatedId Optional related entity ID
 * @returns The created notification object, or null if creation failed
 */
export const createNotification = async (
  userId: string, 
  type: string, 
  title: string, 
  message: string,
  relatedType?: string,
  relatedId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        related_type: relatedType,
        related_id: relatedId,
        read: false
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating notification:', error);
    return null;
  }
};
