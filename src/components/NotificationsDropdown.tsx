import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Circle, Mail, AlertCircle, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/lib/supabase/notifications';
import { Notification } from '@/lib/types';

const NotificationsDropdown: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (!user) return;
    
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNotifications(user.id);
        const transformedNotifications: Notification[] = data.map(n => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          read: n.read,
          relatedId: n.related_id,
          userId: n.user_id,
          createdAt: new Date(n.created_at).getTime()
        }));
        setNotifications(transformedNotifications);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
    
    const intervalId = setInterval(loadNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, [user]);
  
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }
    
    if (notification.type === 'message') {
      navigate(`/messages/${notification.relatedId}`);
    } else if (notification.type === 'application') {
      navigate(`/projects/${notification.relatedId}`);
    } else if (notification.type === 'project_update') {
      navigate(`/projects/${notification.relatedId}`);
    } else if (notification.type === 'application_status') {
      navigate(`/my-projects`);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await markAllNotificationsAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast({
        title: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: 'Failed to mark all as read',
        variant: 'destructive',
      });
    }
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <Mail className="h-4 w-4 mr-2" />;
      case 'application':
        return <Briefcase className="h-4 w-4 mr-2" />;
      case 'application_status':
        return <CheckCircle className="h-4 w-4 mr-2" />;
      case 'project_update':
        return <AlertCircle className="h-4 w-4 mr-2" />;
      default:
        return <Circle className="h-4 w-4 mr-2" />;
    }
  };
  
  if (!user) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="h-5 w-5 flex items-center justify-center p-0 absolute -top-1 -right-1 text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isLoading ? (
          <div className="py-2 px-4 text-center text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-4 px-4 text-center text-muted-foreground">
            <p>No notifications yet</p>
            <p className="text-xs mt-1">When you receive updates, they'll appear here</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map(notification => (
              <DropdownMenuItem 
                key={notification.id}
                className={`py-3 px-4 cursor-pointer ${!notification.read ? 'bg-secondary/50' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  <div className="mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()} &middot; {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="ml-2 mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/settings" className="w-full text-center py-2">
            Notification Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
