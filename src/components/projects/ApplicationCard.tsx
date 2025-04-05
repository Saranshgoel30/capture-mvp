
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ProjectApplication } from '@/lib/types';

interface ApplicationCardProps {
  application: ProjectApplication;
  onStatusUpdate: (application: ProjectApplication, status: 'approved' | 'rejected') => Promise<void>;
  onMessageClick: (application: ProjectApplication) => void;
  isActionInProgress: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ 
  application, 
  onStatusUpdate, 
  onMessageClick,
  isActionInProgress 
}) => {
  const applicantAvatar = application.applicant?.avatar;
  
  const renderStatusBadge = () => {
    if (application.status === 'pending') {
      return (
        <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    } else if (application.status === 'approved') {
      return (
        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1" /> Approved
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>
      );
    }
  };

  return (
    <Collapsible className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-card">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={applicantAvatar} />
            <AvatarFallback>{application.applicant?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium">
                {application.applicant?.name || 'Unknown User'}
              </h4>
              {renderStatusBadge()}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {application.applicant?.roles?.map((role, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/profile/${application.userId}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            View Profile
          </Link>
          <CollapsibleTrigger className="rounded-full p-1 hover:bg-secondary">
            {open => (
              open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />
            )}
          </CollapsibleTrigger>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="p-4 border-t bg-card/50">
          <h5 className="text-sm font-medium mb-2">Cover Letter</h5>
          <div className="bg-background/50 p-3 rounded-md text-sm whitespace-pre-line mb-4">
            {application.coverLetter || 'No cover letter provided.'}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {application.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                  onClick={() => onStatusUpdate(application, 'approved')}
                  disabled={isActionInProgress}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => onStatusUpdate(application, 'rejected')}
                  disabled={isActionInProgress}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </>
            )}
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onMessageClick(application)}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> Message
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ApplicationCard;
