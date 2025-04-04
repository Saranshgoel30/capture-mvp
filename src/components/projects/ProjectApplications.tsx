
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { fetchProjectApplications, updateApplicationStatus, startMessageWithApplicant } from '@/lib/supabase/projectApplications';
import { ProjectApplication } from '@/lib/types';
import { createNotification } from '@/lib/supabase/notifications';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
import ApplicationCard from './ApplicationCard';
import MessageDialog from './MessageDialog';
import LoadingApplications from './LoadingApplications';
import NoApplications from './NoApplications';

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
  
  const handleMessageClick = (application: ProjectApplication) => {
    setSelectedApplication(application);
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
  
  const handleCancelMessage = () => {
    setMessage('');
    setSelectedApplication(null);
  };
  
  if (isLoading) {
    return <LoadingApplications />;
  }
  
  if (!applications || applications.length === 0) {
    return <NoApplications />;
  }
  
  return (
    <div className="space-y-4">
      <Dialog>
        {applications.map((application) => (
          <React.Fragment key={application.id}>
            <ApplicationCard
              application={{
                ...application,
                applicant: {
                  ...application.applicant,
                  avatar: application.applicant?.avatar || getAnimalAvatarForUser(application.userId)
                }
              }}
              onStatusUpdate={handleStatusUpdate}
              onMessageClick={handleMessageClick}
              isActionInProgress={isActionInProgress}
            />
            
            {selectedApplication?.id === application.id && (
              <DialogTrigger className="hidden" />
            )}
          </React.Fragment>
        ))}
        
        {selectedApplication && (
          <MessageDialog
            selectedApplication={selectedApplication}
            message={message}
            onMessageChange={setMessage}
            onSendMessage={handleSendMessage}
            onCancel={handleCancelMessage}
            isActionInProgress={isActionInProgress}
          />
        )}
      </Dialog>
    </div>
  );
};

export default ProjectApplications;
