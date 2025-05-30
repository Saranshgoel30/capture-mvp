
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Check, CheckCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/supabase';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await fetchNotifications(user.id);
      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        message: item.message,
        read: item.read,
        createdAt: new Date(item.created_at).getTime()
      }));
      setNotifications(transformedData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    if (success) {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    const success = await markAllNotificationsAsRead(user.id);
    if (success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Following Gestalt's Law - group notifications by type/time
  const recentNotifications = notifications
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5); // Miller's Law - limit to manageable number

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 p-0 transition-all duration-200 hover:scale-105">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 bg-background border shadow-lg max-h-96 overflow-y-auto" 
        align="end"
      >
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs hover:scale-105 transition-all duration-200"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading notifications...</p>
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications yet</p>
            <p className="text-xs mt-1">You'll see updates here</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {recentNotifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem 
                  className={`flex items-start p-3 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
                    !notification.read ? 'bg-accent/20 border-l-2 border-l-primary' : ''
                  }`}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary rounded-full ml-2 flex-shrink-0 animate-pulse"></div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </DropdownMenuItem>
                {index < recentNotifications.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
