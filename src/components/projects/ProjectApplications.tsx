import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ApplicationCard from './ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProjectApplication } from '@/lib/types';
import { fetchProjectApplications, updateApplicationStatus } from '@/lib/supabase/projectApplications';

interface ProjectApplicationsProps {
  projectId: string;
  isOwner: boolean;
}

const ProjectApplications: React.FC<ProjectApplicationsProps> = ({ projectId, isOwner }) => {
  const [applications, setApplications] = useState<ProjectApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchApplications();
  }, [projectId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isOwner) {
        // If not the owner, only show the current user's applications
        const { data: userData } = await supabase.auth.getUser();
        if (userData && userData.user) {
          const { data, error: fetchError } = await supabase
            .from('applications')
            .select(`
              *
            `)
            .eq('project_id', projectId)
            .eq('applicant_id', userData.user.id);

          if (fetchError) throw fetchError;

          // Format the applications data
          const formattedApplications = await Promise.all((data || []).map(async app => {
            // Get applicant profile data
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', app.applicant_id)
              .single();

            return {
              id: app.id,
              projectId: app.project_id,
              userId: app.applicant_id,
              status: app.status as 'pending' | 'approved' | 'rejected',
              coverLetter: app.cover_letter || '',
              createdAt: new Date(app.created_at || '').getTime(),
              applicant: profileData ? {
                id: profileData.id,
                name: profileData.full_name || 'Unnamed User',
                avatar: profileData.avatar_url || '',
                roles: profileData.roles || []
              } : undefined,
              // Keep original fields for compatibility
              project_id: app.project_id,
              applicant_id: app.applicant_id,
              cover_letter: app.cover_letter,
              created_at: app.created_at
            };
          }));

          setApplications(formattedApplications);
          setLoading(false);
          return;
        }
      } else {
        // For project owners, use the improved fetchProjectApplications function
        const projectApps = await fetchProjectApplications(projectId);
        setApplications(projectApps);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const success = await updateApplicationStatus(applicationId, status);
      
      if (!success) throw new Error('Failed to update application status');

      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));

      toast({
        title: `Application ${status}`,
        description: `The application has been ${status}.`,
      });
    } catch (err: any) {
      console.error('Error updating application:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update application status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {isOwner ? 'Applications' : 'Your Applications'}
      </h3>
      
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={{
                ...application,
                applicant_profile: {
                  id: application.applicant?.id || application.userId,
                  full_name: application.applicant?.name || 'Unknown User',
                  avatar_url: application.applicant?.avatar || '',
                  roles: application.applicant?.roles
                }
              }}
              onAccept={() => handleStatusChange(application.id, "approved")}
              onReject={() => handleStatusChange(application.id, "rejected")}
              isOwner={isOwner}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {isOwner 
            ? "No applications yet. When creators apply to your project, they'll appear here."
            : "You haven't applied to this project yet."}
        </div>
      )}
    </div>
  );
};

export default ProjectApplications;
