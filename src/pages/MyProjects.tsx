
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Briefcase, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Project, ProjectApplication } from '@/lib/types';

const MyProjects = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<
    (Project & { applicationStatus?: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyProjects();
      fetchAppliedProjects();
    }
  }, [user]);

  const fetchMyProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyProjects(data || []);
    } catch (error: any) {
      console.error('Error fetching my projects:', error.message);
      toast({
        title: 'Error fetching projects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedProjects = async () => {
    try {
      // First get all the project applications for the user
      const { data: applications, error: applicationsError } = await supabase
        .from('project_applications')
        .select('*, project_id')
        .eq('user_id', user?.id);

      if (applicationsError) throw applicationsError;

      if (applications && applications.length > 0) {
        // Get the project IDs from the applications
        const projectIds = applications.map((app) => app.project_id);

        // Fetch the projects based on those IDs
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', projectIds);

        if (projectsError) throw projectsError;

        // Combine the projects with their application status
        const enhancedProjects = projects?.map((project) => {
          const application = applications.find(
            (app) => app.project_id === project.id
          ) as ProjectApplication;
          
          return {
            ...project,
            applicationStatus: application?.status || 'pending'
          };
        });

        setAppliedProjects(enhancedProjects || []);
      } else {
        setAppliedProjects([]);
      }
    } catch (error: any) {
      console.error('Error fetching applied projects:', error.message);
      toast({
        title: 'Error fetching applications',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold">Please log in to view your projects</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            You need to be logged in to view your projects and applications.
          </p>
          <Button asChild className="mt-4">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold">My Projects</h1>
        <Button asChild>
          <Link to="/new-project">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-projects">
        <TabsList className="mb-8">
          <TabsTrigger value="my-projects" className="flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Projects I've Posted
          </TabsTrigger>
          <TabsTrigger value="applied-projects" className="flex items-center">
            <Send className="mr-2 h-4 w-4" />
            Projects I've Applied To
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-projects">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : myProjects.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/30">
              <h3 className="text-xl font-medium mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't created any projects yet. Start by creating your first project.
              </p>
              <Button asChild>
                <Link to="/new-project">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      <Link to={`/projects/${project.id}`} className="hover:underline">
                        {project.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Posted on {new Date(project.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.skills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills && project.skills.length > 3 && (
                        <Badge variant="outline">+{project.skills.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Badge variant="secondary">
                      {project.type} • {project.budget_range}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applied-projects">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : appliedProjects.length === 0 ? (
            <div className="text-center py-12 border rounded-md bg-muted/30">
              <h3 className="text-xl font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't applied to any projects yet. Browse available projects and start applying!
              </p>
              <Button asChild>
                <Link to="/projects">Browse Projects</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {appliedProjects.map((project) => (
                <Card key={project.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="line-clamp-2">
                        <Link to={`/projects/${project.id}`} className="hover:underline">
                          {project.title}
                        </Link>
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(project.applicationStatus || '')}>
                        {project.applicationStatus === 'accepted' ? 'Accepted' :
                         project.applicationStatus === 'rejected' ? 'Rejected' : 'Pending'}
                      </Badge>
                    </div>
                    <CardDescription>
                      Applied on {new Date(project.created_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.skills?.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                      {project.skills && project.skills.length > 3 && (
                        <Badge variant="outline">+{project.skills.length - 3} more</Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <Badge variant="secondary">
                      {project.type} • {project.budget_range}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/projects/${project.id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyProjects;
