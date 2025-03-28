
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, User, Users, ArrowLeft, CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { fetchProjectById, applyForProject } from '@/lib/supabase';
import { useAuth } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Project } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  
  useEffect(() => {
    if (!projectId) return;
    
    const loadProject = async () => {
      setIsLoading(true);
      try {
        const projectData = await fetchProjectById(projectId);
        setProject(projectData);
        
        // Check if the project deadline has passed
        if (projectData) {
          const deadlineDate = new Date(projectData.deadline);
          const today = new Date();
          setIsExpired(deadlineDate < today);
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
    
    setIsApplying(true);
    try {
      await applyForProject(projectId, user.id, coverLetter);
      toast({
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted!',
      });
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
            </div>
            
            <div>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-semibold mb-4">Posted by</h2>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={project.postedByAvatar || 'https://i.pravatar.cc/150?img=8'} />
                      <AvatarFallback>{project.postedBy.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.postedBy}</p>
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-semibold mb-4">Apply for this project</h2>
                  
                  {user ? (
                    <>
                      <Textarea
                        placeholder="Write a brief message explaining why you're a good fit for this project..."
                        className="mb-4"
                        rows={5}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        disabled={isApplying || isExpired}
                      />
                      <Button 
                        className="w-full" 
                        onClick={handleApply}
                        disabled={isApplying || isExpired}
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
                    </>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 rounded-md">
                      <User className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 mb-2">Sign in to apply for this project</p>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/login')}
                      >
                        Sign In
                      </Button>
                    </div>
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
