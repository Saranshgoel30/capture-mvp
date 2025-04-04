import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Clock, 
  UserCheck, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { fetchProjectApplications, updateApplicationStatus, startMessageWithApplicant } from '@/lib/supabase/projectApplications';
import { ProjectApplication } from '@/lib/types';
import { createNotification } from '@/lib/supabase/notifications';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';

interface ProjectApplicationsProps {
  projectId: string;
  projectTitle: string;
}

const ProjectApplications: React.FC<ProjectApplicationsProps> = ({ projectId, projectTitle }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<ProjectApplication | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  
  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProjectApplications(projectId);
        setApplications(data);
      } catch (error) {
        console.error('Failed to load applications:', error);
        toast({
          title: 'Error loading applications',
          description: 'Could not retrieve applications for this project.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApplications();
  }, [projectId]);
  
  const handleStatusUpdate = async (application: ProjectApplication, status: 'approved' | 'rejected') => {
    if (!application || !application.id) return;
    
    setIsActionInProgress(true);
    try {
      const success = await updateApplicationStatus(application.id, status);
      
      if (success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === application.id ? { ...app, status } : app
          )
        );
        
        await createNotification(
          application.userId,
          'application_status',
          `Application ${status === 'approved' ? 'Accepted' : 'Rejected'}`,
          `Your application for the project "${projectTitle}" has been ${status === 'approved' ? 'accepted' : 'rejected'}.`,
          projectId,
          'project'
        );
        
        toast({
          title: `Application ${status === 'approved' ? 'Approved' : 'Rejected'}`,
          description: `Successfully ${status === 'approved' ? 'approved' : 'rejected'} the application.`,
        });
      } else {
        throw new Error('Failed to update application status');
      }
    } catch (error) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} application:`, error);
      toast({
        title: `Failed to ${status === 'approved' ? 'approve' : 'reject'} application`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsActionInProgress(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!selectedApplication || !message.trim()) return;
    
    setIsActionInProgress(true);
    try {
      const success = await startMessageWithApplicant(
        projectId,
        selectedApplication.userId,
        message
      );
      
      if (success) {
        await createNotification(
          selectedApplication.userId,
          'message',
          'New message',
          `You have a new message regarding your application to "${projectTitle}".`,
          selectedApplication.userId,
          'message'
        );
        
        toast({
          title: 'Message sent',
          description: 'Your message has been sent successfully.',
        });
        
        navigate(`/messages/${selectedApplication.userId}`);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setMessage('');
      setSelectedApplication(null);
      setIsActionInProgress(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Clock className="animate-spin h-6 w-6 mr-2" />
        <span>Loading applications...</span>
      </div>
    );
  }
  
  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No applications yet</h3>
        <p className="text-muted-foreground">
          When people apply to your project, their applications will appear here.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {applications.map((application) => {
        const applicantAvatar = application.applicant?.avatar || getAnimalAvatarForUser(application.userId);
        
        return (
          <Collapsible key={application.id} className="border rounded-lg overflow-hidden">
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
                    {application.status === 'pending' ? (
                      <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    ) : application.status === 'approved' ? (
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" /> Approved
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">
                        <XCircle className="h-3 w-3 mr-1" /> Rejected
                      </Badge>
                    )}
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
                  {(props: { open: boolean }) => 
                    props.open 
                      ? <ChevronUp className="h-5 w-5" /> 
                      : <ChevronDown className="h-5 w-5" />
                  }
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
                        onClick={() => handleStatusUpdate(application, 'approved')}
                        disabled={isActionInProgress}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => handleStatusUpdate(application, 'rejected')}
                        disabled={isActionInProgress}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" /> Message
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Message to {application.applicant?.name || 'Applicant'}</DialogTitle>
                        <DialogDescription>
                          This will start a conversation with the applicant.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-2">
                        <Textarea
                          placeholder="Write your message here..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={5}
                          className="w-full"
                        />
                      </div>
                      
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setMessage('');
                            setSelectedApplication(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || isActionInProgress}
                        >
                          {isActionInProgress ? (
                            <>
                              <Clock className="animate-spin h-4 w-4 mr-1" /> Sending...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-4 w-4 mr-1" /> Send Message
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default ProjectApplications;
