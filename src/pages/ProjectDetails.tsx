
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, MapPin, Users, ArrowLeft, BookmarkPlus, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProjectById, applyForProject } from '@/lib/supabase/projects';
import { Project } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching project with ID:", projectId);
        const fetchedProject = await fetchProjectById(projectId);
        console.log("Fetched project:", fetchedProject);
        setProject(fetchedProject);
        if (!fetchedProject) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Project not found. It may have been removed.",
          });
        }
      } catch (error) {
        console.error('Error loading project details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load project details. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId, toast]);

  const handleApply = async () => {
    if (!user || !project || !projectId) {
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to apply for this project",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      return;
    }

    setIsApplying(true);
    try {
      // Add an empty string as the coverLetter parameter
      await applyForProject(projectId, user.id, '');
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
      
      // Update the local state to reflect the new applicant count
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          applicants: prev.applicants + 1
        };
      });
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your application. Please try again.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
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
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/projects')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
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
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/projects')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
                <div>
                  <Badge variant="outline" className="mb-2">{project.type}</Badge>
                  <CardTitle className="text-3xl">{project.title}</CardTitle>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                  >
                    <BookmarkPlus size={18} />
                    <span className="hidden md:inline">Save</span>
                  </Button>
                  <Button 
                    onClick={handleApply} 
                    disabled={isApplying}
                    className="gap-2"
                  >
                    {isApplying ? (
                      <div className="animate-spin w-4 h-4 border-2 border-background border-t-transparent rounded-full mr-2"></div>
                    ) : (
                      <Send size={18} />
                    )}
                    Apply Now
                  </Button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-muted-foreground">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {project.location}
                </div>
                <span className="hidden sm:block">•</span>
                <div className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {project.timeline}
                </div>
                <span className="hidden sm:block">•</span>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  Due {project.deadline}
                </div>
                <span className="hidden sm:block">•</span>
                <div className="flex items-center">
                  <Users size={16} className="mr-1" />
                  {project.applicants} applicant{project.applicants !== 1 ? 's' : ''}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Description</h3>
                <p className="whitespace-pre-line">{project.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Roles Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {project.rolesNeeded.map((role, index) => (
                    <Badge key={index} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center border-t pt-6">
              <div className="flex items-center mb-4 sm:mb-0">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img 
                    src={project.postedByAvatar || 'https://i.pravatar.cc/150?img=5'} 
                    alt={project.postedBy} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{project.postedBy}</p>
                  <p className="text-sm text-muted-foreground">Project Creator</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <Button 
                  onClick={handleApply} 
                  disabled={isApplying}
                >
                  {isApplying ? 'Applying...' : 'Apply Now'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProjectDetails;
