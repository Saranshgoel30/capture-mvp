
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, User, Check, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MessageDialog from './MessageDialog';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';

interface ApplicationCardProps {
  application: {
    id: string;
    projectId: string;
    project?: {
      title: string;
    };
    applicantId: string;
    applicant?: {
      full_name?: string;
      avatar_url?: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    message: string;
    created_at: string;
  };
  viewType: 'owner' | 'applicant';
  onStatusChange?: (id: string, status: 'accepted' | 'rejected') => Promise<void>;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  viewType, 
  onStatusChange 
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleStatusChange = async (status: 'accepted' | 'rejected') => {
    if (!onStatusChange) return;
    
    setIsLoading(true);
    try {
      await onStatusChange(application.id, status);
      toast({
        title: `Application ${status}`,
        description: `You have ${status} the application.`,
      });
    } catch (error) {
      console.error('Error changing application status:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the application status.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get applicant avatar or use animal avatar
  const avatarUrl = application.applicant?.avatar_url || getAnimalAvatarForUser(application.applicantId);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                <User size={20} />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">
                {application.applicant?.full_name || 'Anonymous Creator'}
              </h3>
              <MessageDialog
                receiverId={application.applicantId}
                triggerButton={
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
                    <MessageSquare size={12} />
                    Message
                  </Button>
                }
              />
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <Badge 
              variant={
                application.status === 'accepted' ? 'success' :
                application.status === 'rejected' ? 'destructive' : 'outline'
              }
              className="mb-1"
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Clock size={12} />
              <span>{formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        
        <div className="my-4">
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {application.message}
          </p>
        </div>
        
        {viewType === 'applicant' && application.project && (
          <div className="mt-4">
            <p className="text-sm font-medium">Applied to</p>
            <Link to={`/projects/${application.projectId}`} className="text-primary hover:underline">
              {application.project.title}
            </Link>
          </div>
        )}
      </CardContent>
      
      {viewType === 'owner' && application.status === 'pending' && (
        <CardFooter className="flex gap-2 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-1" 
            disabled={isLoading}
            onClick={() => handleStatusChange('rejected')}
          >
            <X size={14} />
            Decline
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="w-full gap-1" 
            disabled={isLoading}
            onClick={() => handleStatusChange('accepted')}
          >
            <Check size={14} />
            Accept
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ApplicationCard;
