import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ApplicationCard from './ApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ProjectApplicationsProps {
  projectId: string;
  isOwner: boolean;
}

const ProjectApplications: React.FC<ProjectApplicationsProps> = ({ projectId, isOwner }) => {
  const [applications, setApplications] = useState<any[]>([]);
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

      let query = supabase
        .from('applications')
        .select(`
          *,
          applicant_profile:applicant_id (
            id,
            full_name,
            avatar_url,
            bio,
            city,
            roles,
            skills
          )
        `)
        .eq('project_id', projectId);

      // If not the owner, only show the current user's applications
      if (!isOwner) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          query = query.eq('applicant_id', user.id);
        }
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;

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
                  ...application.applicant_profile,
                  // Replace avatar with avatar_url
                  avatar_url: application.applicant_profile?.avatar_url || ""
                }
              }}
              onAccept={() => handleStatusChange(application.id, "accepted")}
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
