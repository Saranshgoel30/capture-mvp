
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Filter, Search, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects } from '@/lib/supabase';
import { Project } from '@/lib/types';
import NewProjectForm from '@/components/projects/NewProjectForm';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [userApplications, setUserApplications] = useState<string[]>([]);
  // Initialize modal state based on location state
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(
    location.state?.openNewProjectModal || false
  );
  const navigate = useNavigate();
  
  // Clear the location state after using it
  useEffect(() => {
    if (location.state?.openNewProjectModal) {
      // Replace the current entry in the history stack to clear the state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Categories for filtering
  const categories = ["All", "Documentary", "Short Film", "Music Video", "Podcast", "Marketing", "Photography"];

  // Fetch user's applications
  useEffect(() => {
    if (user) {
      const fetchUserApplications = async () => {
        try {
          const { data, error } = await supabase
            .from('applications')
            .select('project_id')
            .eq('applicant_id', user.id);
            
          if (error) throw error;
          
          if (data) {
            setUserApplications(data.map(app => app.project_id));
          }
        } catch (error) {
          console.error('Error fetching user applications:', error);
        }
      };
      
      fetchUserApplications();
    }
  }, [user]);

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const fetchedProjects = await fetchProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects based on search query and selected category
  useEffect(() => {
    let filtered = [...projects];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.type === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.rolesNeeded.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredProjects(filtered);
  }, [projects, searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Function to check if a project deadline has passed
  const isProjectActive = (deadline: string) => {
    try {
      // Parse the deadline string in D/M/YYYY format
      const deadlineParts = deadline.split('/');
      
      // Ensure we have 3 parts
      if (deadlineParts.length !== 3) {
        console.error('Invalid deadline format:', deadline);
        return true; // Default to active if format is invalid
      }
      
      // Create date using D/M/YYYY format
      const deadlineDate = new Date(
        parseInt(deadlineParts[2]), // Year
        parseInt(deadlineParts[1]) - 1, // Month (0-indexed)
        parseInt(deadlineParts[0]) // Day
      );
      
      // If the date is invalid, log error and default to active
      if (isNaN(deadlineDate.getTime())) {
        console.error('Could not parse deadline:', deadline);
        return true;
      }
      
      // Reset hours to compare just the dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);
      
      return deadlineDate >= today;
    } catch (error) {
      console.error('Error parsing deadline:', error);
      return true; // Default to active if parsing fails
    }
  };

  // Function to handle project application
  const handleApply = async (projectId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for projects",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    try {
      // Check if user has already applied
      if (userApplications.includes(projectId)) {
        toast({
          title: "Already applied",
          description: "You have already applied to this project",
          variant: "default",
        });
        return;
      }

      // Create application
      const { error } = await supabase
        .from('applications')
        .insert({
          id: crypto.randomUUID(), // Generate a unique ID
          project_id: projectId,
          applicant_id: user.id,
          status: 'pending',
          cover_letter: '', // Add empty cover letter
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Update local state
      setUserApplications([...userApplications, projectId]);

      toast({
        title: "Application submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (error: any) {
      console.error('Error applying to project:', error);
      toast({
        title: "Application failed",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">PROJECTS</h1>
              <p className="text-muted-foreground">Find your next creative collaboration</p>
            </div>
            <Button 
              className="mt-4 md:mt-0 rounded-full"
              onClick={() => setIsNewProjectModalOpen(true)}
            >
              <Plus size={18} className="mr-2" />
              Post a Project
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search projects, roles, locations..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex gap-2">
                <Filter size={18} />
                <span>Filters</span>
              </Button>
            </div>
            
            <Tabs defaultValue={selectedCategory} className="w-full" onValueChange={handleCategoryChange}>
              <TabsList className="w-full justify-start overflow-x-auto py-2 mb-2">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="min-w-fit">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          )}
          
          {/* Projects Grid */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => {
                const projectActive = isProjectActive(project.deadline);
                const hasApplied = userApplications.includes(project.id);
                
                return (
                  <Card key={project.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <Badge variant="outline" className="mb-2">{project.type}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users size={14} className="mr-1" />
                          <span>{project.applicants}</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {project.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-2 flex-grow">
                      <div className="flex items-center text-sm mb-3 text-muted-foreground">
                        <Clock size={14} className="mr-1" />
                        <span>{project.timeline}</span>
                        <span className="mx-2">•</span>
                        <Calendar size={14} className="mr-1" />
                        <span>Due {project.deadline}</span>
                        {!projectActive && (
                          <Badge variant="destructive" className="ml-2 text-xs">Expired</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-4 line-clamp-3">{project.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Roles Needed:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {project.rolesNeeded.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t">
                      <div className="w-full flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <Link to={`/projects/${project.id}`}>View Details</Link>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          disabled={!projectActive || hasApplied}
                          onClick={() => handleApply(project.id)}
                        >
                          {hasApplied ? 'Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* No Projects Found */}
          {!isLoading && filteredProjects.length === 0 && (
            <div className="text-center py-20 border rounded-lg">
              <h3 className="text-xl font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <NewProjectForm 
          isOpen={isNewProjectModalOpen} 
          onClose={() => setIsNewProjectModalOpen(false)}
          onSuccess={() => {
            setIsNewProjectModalOpen(false);
            setTimeout(() => fetchProjects().then(setProjects), 100);
          }}
        />
      )}
    </div>
  );
};

export default Projects;
