
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyProjects: React.FC = () => {
  const { user } = useAuth();
  const [postedProjects, setPostedProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchPostedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setPostedProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching posted projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your posted projects',
        variant: 'destructive',
      });
    }
  };

  const fetchAppliedProjects = async () => {
    try {
      // First get the applications
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('project_id, status')
        .eq('applicant_id', user.id);

      if (appError) {
        throw appError;
      }

      if (!applications || applications.length === 0) {
        setAppliedProjects([]);
        return;
      }

      // Get the project IDs from applications
      const projectIds = applications.map(app => app.project_id);

      // Fetch the projects using the project IDs
      const { data: projects, error: projError } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds);

      if (projError) {
        throw projError;
      }

      // Add application status to each project
      const projectsWithStatus = projects.map(project => {
        const application = applications.find(app => app.project_id === project.id);
        return {
          ...project,
          applicationStatus: application?.status || 'pending'
        };
      });

      setAppliedProjects(projectsWithStatus);
    } catch (error: any) {
      console.error('Error fetching applied projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects you applied for',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        fetchPostedProjects(),
        fetchAppliedProjects()
      ]).finally(() => {
        setIsLoading(false);
      });
    }
  }, [user]);

  const ProjectList = ({ projects, type }: { projects: any[], type: 'posted' | 'applied' }) => {
    if (projects.length === 0) {
      return (
        <div className="text-center py-20">
          <h3 className="text-lg font-medium mb-2">
            {type === 'posted' 
              ? "You haven't posted any projects yet" 
              : "You haven't applied to any projects yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {type === 'posted'
              ? "Create a project to find collaborators for your next creative endeavor."
              : "Browse the projects page to find opportunities that match your skills."}
          </p>
          <Link to={type === 'posted' ? '/projects' : '/projects'}>
            <Button>
              {type === 'posted' ? 'Create a Project' : 'Browse Projects'}
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-all duration-200">
            <CardHeader>
              <CardTitle className="line-clamp-1">{project.title}</CardTitle>
              <CardDescription className="flex items-center text-sm gap-1">
                <MapPin size={14} />
                {project.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm line-clamp-3">{project.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={14} className="mr-1" />
                  <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.required_roles && project.required_roles.map((role: string, idx: number) => (
                    <Badge key={idx} variant="outline">{role}</Badge>
                  ))}
                </div>
                {type === 'applied' && (
                  <div className="mt-2">
                    <Badge
                      variant={
                        project.applicationStatus === 'approved' ? 'default' :
                        project.applicationStatus === 'rejected' ? 'destructive' : 'secondary'
                      }
                    >
                      {project.applicationStatus.charAt(0).toUpperCase() + project.applicationStatus.slice(1)}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link to={`/projects/${project.id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Projects</h1>
          
          <Tabs defaultValue="posted">
            <TabsList className="mb-6">
              <TabsTrigger value="posted">Posted Projects</TabsTrigger>
              <TabsTrigger value="applied">Applications</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="posted">
                  <ProjectList projects={postedProjects} type="posted" />
                </TabsContent>
                <TabsContent value="applied">
                  <ProjectList projects={appliedProjects} type="applied" />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProjects;
