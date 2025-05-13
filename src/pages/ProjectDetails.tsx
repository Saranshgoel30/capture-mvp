
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, User, ArrowLeft, AlertTriangle, MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { fetchProjectById } from '@/lib/supabase';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Project } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';
import ProjectApplications from '@/components/projects/ProjectApplications';
import ApplicationForm from '@/components/project-application/ApplicationForm';
import ApplicationSuccess from '@/components/project-application/ApplicationSuccess';
import LoginPrompt from '@/components/project-application/LoginPrompt';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  
  const isOwner = project?.ownerId === user?.id;
  
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      try {
        setIsLoading(true);
        
        const projectData = await fetchProjectById(projectId);
        
        if (!projectData) {
          toast({
            title: 'Project Not Found',
            description: 'The requested project could not be found.',
            variant: 'destructive',
          });
          navigate('/projects');
          return;
        }
        
        setProject(projectData);
        
        // Check if project deadline has passed
        const deadlineDate = new Date(projectData.deadline);
        const currentDate = new Date();
        setIsExpired(deadlineDate < currentDate);
        
        // Check if the user has already applied
        if (user && projectId) {
          // This would be handled by the backend
          setHasApplied(false); // Will be updated when applications are loaded
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjectData();
  }, [projectId, user, navigate, toast]);
  
  const handleMessageCreator = () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to message the project creator.',
        variant: 'destructive',
      });
      return;
    }
    
    // Navigate to messages with this user
    navigate(`/messages?user=${project?.ownerId}`);
  };
  
  const handleApplicationSubmitted = () => {
    setHasApplied(true);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 w-32 bg-muted rounded mb-6"></div>
              <div className="h-10 w-3/4 bg-muted rounded mb-4"></div>
              <div className="h-6 w-1/2 bg-muted rounded mb-8"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="border rounded-lg p-6">
                    <div className="h-5 w-40 bg-muted rounded mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-3/4 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="border rounded-lg p-6">
                    <div className="h-5 w-24 bg-muted rounded mb-4"></div>
                    <div className="flex items-center mb-6">
                      <div className="h-10 w-10 rounded-full bg-muted mr-3"></div>
                      <div className="h-4 w-24 bg-muted rounded"></div>
                    </div>
                    <div className="h-5 w-32 bg-muted rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-10 w-full bg-muted rounded"></div>
                      <div className="h-24 w-full bg-muted rounded"></div>
                      <div className="h-10 w-full bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const ownerAvatar = getAnimalEmojiForUser(project.postedById);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-4"
              onClick={() => navigate('/projects')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
            
            {isExpired && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Project Expired</AlertTitle>
                <AlertDescription>
                  This project has passed its deadline and is no longer accepting applications.
                </AlertDescription>
              </Alert>
            )}
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.title}</h1>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="outline">{project.type}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin size={16} className="mr-1" />
                {project.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar size={16} className="mr-1" />
                <span>Due {project.deadline}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock size={16} className="mr-1" />
                <span>{project.timeline}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">About This Project</h2>
                  <p className="text-gray-700 whitespace-pre-line mb-6">
                    {project.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-2">Roles Needed</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.rolesNeeded.map((role, index) => (
                      <Badge key={index} variant="secondary">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {isOwner && (
                <div className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <ProjectApplications 
                        projectId={projectId || ''} 
                        isOwner={true}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {!isOwner && user && (
                <div className="mt-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4">Your Applications</h3>
                      <ProjectApplications 
                        projectId={projectId || ''} 
                        isOwner={false}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Posted by</h2>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={project.postedByAvatar || ownerAvatar} />
                      <AvatarFallback>{getAnimalEmojiForUser(project.postedById)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-medium">{project.postedBy}</p>
                      {project.postedById !== user?.id && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center -ml-2 mt-1 text-muted-foreground hover:text-foreground"
                          onClick={handleMessageCreator}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {project.postedById !== user?.id && (
                    <>
                      <h2 className="text-lg font-semibold mb-4">Apply for this project</h2>
                      
                      {user ? (
                        <>
                          {hasApplied ? (
                            <ApplicationSuccess />
                          ) : (
                            <ApplicationForm
                              projectId={projectId || ''}
                              userId={user.id}
                              rolesNeeded={project.rolesNeeded}
                              isExpired={isExpired}
                              onApplicationSubmitted={handleApplicationSubmitted}
                            />
                          )}
                        </>
                      ) : (
                        <LoginPrompt />
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
