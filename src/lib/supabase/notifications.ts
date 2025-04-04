
import { supabase } from './client';
import { Notification } from '@/lib/types';

// Fetch notifications for a user
export const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    // Use the notifications table type definition
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    // Transform the data to match the expected types
    return (data || []).map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      read: notification.read || false,
      relatedId: notification.related_id,
      relatedType: notification.related_type,
      createdAt: notification.created_at ? new Date(notification.created_at).getTime() : Date.now(),
    }));
  } catch (error) {
    console.error('Exception fetching notifications:', error);
    return [];
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
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

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);
    
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

// Create a notification
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  relatedId?: string,
  relatedType?: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        message,
        related_id: relatedId,
        related_type: relatedType,
        read: false
      });
    
    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception creating notification:', error);
    return false;
  }
};
