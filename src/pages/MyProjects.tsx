
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Calendar, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MyProjects: React.FC = () => {
  const { user } = useAuth();
  const [ownProjects, setOwnProjects] = useState<Project[]>([]);
  const [appliedProjects, setAppliedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOwnProjects();
      fetchAppliedProjects();
    }
  }, [user]);

  // Function to fetch projects created by the current user
  const fetchOwnProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the Project type
      const transformedProjects: Project[] = data.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        location: project.location,
        deadline: new Date(project.deadline).toLocaleDateString(),
        requiredRoles: project.required_roles || [],
        ownerId: project.owner_id,
        createdAt: new Date(project.created_at).getTime(),
        type: determineProjectType(project.title),
        timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
        rolesNeeded: project.required_roles || [],
        // We'll get profile data later if needed
        postedBy: user?.email || 'Me',
        postedById: project.owner_id,
        // Add other required fields with defaults
        owner_id: project.owner_id,
        required_roles: project.required_roles,
        created_at: project.created_at
      }));

      setOwnProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching your projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your projects. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch projects the user has applied to
  const fetchAppliedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          projects:project_id (*)
        `)
        .eq('applicant_id', user?.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        setAppliedProjects([]);
        return;
      }

      // Transform data to match the Project type
      const transformedProjects: Project[] = data.map(app => {
        const project = app.projects;
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          location: project.location,
          deadline: new Date(project.deadline).toLocaleDateString(),
          requiredRoles: project.required_roles || [],
          ownerId: project.owner_id,
          createdAt: new Date(project.created_at).getTime(),
          type: determineProjectType(project.title),
          timeline: `Until ${new Date(project.deadline).toLocaleDateString()}`,
          rolesNeeded: project.required_roles || [],
          // Add application status as a custom field
          applicationStatus: app.status,
          // We'll get profile data later if needed
          postedById: project.owner_id,
          // Add other required fields with defaults
          owner_id: project.owner_id,
          required_roles: project.required_roles,
          created_at: project.created_at
        };
      });

      setAppliedProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching applied projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch your applications. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to determine project type based on title
  const determineProjectType = (title: string): string => {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('film') || titleLower.includes('movie')) {
      return 'Short Film';
    } else if (titleLower.includes('music') || titleLower.includes('video')) {
      return 'Music Video';
    } else if (titleLower.includes('photo') || titleLower.includes('shoot')) {
      return 'Photography';
    } else if (titleLower.includes('podcast')) {
      return 'Podcast';
    } else if (titleLower.includes('commercial') || titleLower.includes('marketing')) {
      return 'Marketing';
    } else if (titleLower.includes('documentary')) {
      return 'Documentary';
    } else {
      return 'Other';
    }
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Projects</h1>
          
          <Tabs defaultValue="own" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="own">Posted Projects</TabsTrigger>
              <TabsTrigger value="applied">Applied Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="own">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {ownProjects.length > 0 ? (
                  ownProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="bg-primary-foreground pb-2">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        <Badge variant="outline" className="w-fit mb-1">{project.type}</Badge>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{project.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-primary" />
                            <div className="flex flex-wrap gap-1">
                              {project.requiredRoles.slice(0, 3).map((role, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                              {project.requiredRoles.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.requiredRoles.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 bg-primary-foreground/50 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/projects/${project.id}`}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-medium mb-2">You haven't posted any projects yet</h3>
                    <p className="text-muted-foreground mb-6">Create a project and find collaborators</p>
                    <Button onClick={() => window.location.href = '/projects'}>
                      Browse Projects
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="applied">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appliedProjects.length > 0 ? (
                  appliedProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                      <CardHeader className="bg-primary-foreground pb-2">
                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                        <div className="flex gap-2 mb-1">
                          <Badge variant="outline">{project.type}</Badge>
                          <Badge 
                            variant={
                              project.applicationStatus === 'approved' ? 'success' : 
                              project.applicationStatus === 'rejected' ? 'destructive' : 
                              'secondary'
                            }
                          >
                            {project.applicationStatus === 'approved' ? 'Approved' : 
                             project.applicationStatus === 'rejected' ? 'Rejected' : 
                             'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {project.description}
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{project.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{project.deadline}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2 bg-primary-foreground/50 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/projects/${project.id}`}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <h3 className="text-xl font-medium mb-2">You haven't applied to any projects</h3>
                    <p className="text-muted-foreground mb-6">Browse projects and apply to collaborate</p>
                    <Button onClick={() => window.location.href = '/projects'}>
                      Browse Projects
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyProjects;
