
import React from 'react';
import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectApplication } from '@/lib/types';
import { updateApplicationStatus } from '@/lib/supabase/projectApplications';
import { useToast } from "@/hooks/use-toast";
import MessageDialog from './MessageDialog';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';

interface ApplicationCardProps {
  application: ProjectApplication;
  isOwner: boolean;
  onStatusChange?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  isOwner,
  onStatusChange
}) => {
  const { toast } = useToast();
  const [showMessageDialog, setShowMessageDialog] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);
  
  const handleStatusChange = async (newStatus: 'approved' | 'rejected') => {
    if (!isOwner) return;
    
    setIsUpdating(true);
    try {
      const success = await updateApplicationStatus(application.id, newStatus);
      
      if (success) {
        toast({
          title: `Application ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
          description: `You have successfully ${newStatus} the application.`
        });
        
        if (onStatusChange) {
          onStatusChange();
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to update application status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const getStatusBadgeColor = () => {
    switch (application.status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };
  
  const avatarImage = application.applicant?.avatar;
  const avatarFallback = getAnimalEmojiForUser(application.userId);
  
  return (
    <Card className="mb-4">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarImage} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{application.applicant?.name || 'Unknown User'}</p>
              <div className="flex gap-2 flex-wrap mt-1">
                {application.selectedRole && (
                  <Badge variant="outline" className="text-xs">
                    Applied for: {application.selectedRole}
                  </Badge>
                )}
                <Badge className={`text-xs ${getStatusBadgeColor()}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                {application.applicant?.roles?.map((role, index) => (
                  <Badge variant="secondary" key={index} className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Applied on {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {isOwner && application.status === 'pending' && (
            <div className="space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="border-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => handleStatusChange('approved')}
                disabled={isUpdating}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => handleStatusChange('rejected')}
                disabled={isUpdating}
              >
                <XCircle className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
        
        {application.coverLetter && (
          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm whitespace-pre-line">{application.coverLetter}</p>
          </div>
        )}
        
        {isOwner && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center text-muted-foreground hover:text-foreground"
              onClick={() => setShowMessageDialog(true)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Applicant
            </Button>
            
            <MessageDialog 
              isOpen={showMessageDialog}
              onClose={() => setShowMessageDialog(false)}
              projectId={application.projectId}
              applicantId={application.userId}
              applicantName={application.applicant?.name || 'Applicant'}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
