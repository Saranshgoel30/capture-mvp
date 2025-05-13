
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, User, Users, ArrowLeft, CheckCircle,
  AlertTriangle, MessageSquare
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { fetchProjectById, applyForProject } from '@/lib/supabase';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Project } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';
import ProjectApplications from '@/components/projects/ProjectApplications';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const isOwner = project?.ownerId === user?.id;
  
  useEffect(() => {
    if (!projectId) return;
    
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const projectData = await fetchProjectById(projectId);
        setProject(projectData);
        
        if (projectData) {
          // Fix the date parsing issue - the deadline comes as a formatted string
          // We need to parse it correctly
          const deadlineParts = projectData.deadline.split('/');
          // Handle both MM/DD/YYYY and DD/MM/YYYY formats
          const deadlineDate = new Date(
            parseInt(deadlineParts[2]), // Year
            parseInt(deadlineParts[0]) - 1, // Month (0-indexed)
            parseInt(deadlineParts[1]) // Day
          );
          const today = new Date();
          
          // Reset hours to compare just the dates
          today.setHours(0, 0, 0, 0);
          deadlineDate.setHours(0, 0, 0, 0);
          
          setIsExpired(deadlineDate < today);
        }

        // Check if the user has already applied to this project
        if (user) {
          try {
            const { data: existingApplication } = await supabase
              .from('applications')
              .select('id')
              .eq('project_id', projectId)
              .eq('applicant_id', user.id)
              .maybeSingle();
            
            setHasApplied(!!existingApplication);
          } catch (checkError) {
            console.error('Error checking application status:', checkError);
            // Don't set an error toast here as it's not critical
          }
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
    
    loadProject();
  }, [projectId, toast]);
  
  const handleApply = async () => {
    if (!user || !projectId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply for this project.',
        variant: 'destructive',
      });
      return;
    }
    
    if (isExpired) {
      toast({
        title: 'Project Expired',
        description: 'This project has passed its deadline and is no longer accepting applications.',
        variant: 'destructive', 
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select a role you want to apply for.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsApplying(true);
    try {
      await applyForProject(projectId, user.id, coverLetter, selectedRole);
      toast({
        title: 'Application Submitted',
        description: `Your application for the role of ${selectedRole} has been successfully submitted!`,
      });
      setHasApplied(true);
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        title: 'Application Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  const handleMessageCreator = () => {
    if (project && project.postedById) {
      navigate(`/messages/${project.postedById}`);
    }
  };
  
  const handleMessageApplicant = (applicantId: string) => {
    navigate(`/messages/${applicantId}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-24 bg-gray-200 rounded mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or may have been removed.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
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
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Project Applications</h2>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowApplications(!showApplications)}
                      >
                        {showApplications ? 'Hide' : 'View'} Applications
                      </Button>
                    </div>
                    
                    {showApplications && (
                      <ProjectApplications projectId={project.id} isOwner={isOwner} />
                    )}
                  </CardContent>
                </Card>
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
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-center">
                              <CheckCircle className="h-8 w-8 mx-auto text-green-600 dark:text-green-400 mb-2" />
                              <p className="text-green-800 dark:text-green-300 font-medium">Application Submitted</p>
                              <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                                You'll be notified if the creator responds.
                              </p>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <FormLabel>Select Role</FormLabel>
                                  <Select 
                                    value={selectedRole} 
                                    onValueChange={setSelectedRole}
                                    disabled={isApplying || isExpired}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a role to apply for" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {project.rolesNeeded.map((role, index) => (
                                        <SelectItem key={index} value={role}>
                                          {role}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  {!selectedRole && (
                                    <p className="text-sm text-muted-foreground">
                                      Choose a role that best matches your skills
                                    </p>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <FormLabel>Cover Letter</FormLabel>
                                  <Textarea
                                    placeholder="Write a brief message explaining why you're a good fit for this role..."
                                    className="mb-4"
                                    rows={5}
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    disabled={isApplying || isExpired}
                                  />
                                </div>
                                
                                <Button 
                                  className="w-full" 
                                  onClick={handleApply}
                                  disabled={isApplying || isExpired || !selectedRole}
                                >
                                  {isApplying ? (
                                    <>
                                      <span className="mr-2">Submitting...</span>
                                      <div className="animate-spin">
                                        <Clock className="h-4 w-4" />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Apply Now
                                    </>
                                  )}
                                </Button>
                                {isExpired && (
                                  <p className="text-destructive text-sm mt-2">
                                    This project has passed its deadline and is no longer accepting applications.
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                          <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-gray-600 dark:text-gray-300 mb-2">Sign in to apply for this project</p>
                          <Button
                            variant="outline"
                            onClick={() => navigate('/login')}
                          >
                            Sign In
                          </Button>
                        </div>
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
