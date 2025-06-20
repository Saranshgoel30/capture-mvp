import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, MapPin, Plus, Search, Filter, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects } from '@/lib/supabase';
import { Project } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewProjectForm from '@/components/projects/NewProjectForm';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchTerm, selectedType, selectedLocation]);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load projects. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.rolesNeeded.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(project => project.type === selectedType);
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(project => project.location === selectedLocation);
    }

    setFilteredProjects(filtered);
  };

  const handleNewProject = () => {
    setShowNewProjectForm(false);
    loadProjects();
    toast({
      title: 'Project Created',
      description: 'Your project has been successfully created and is now live!',
    });
  };

  const uniqueTypes = Array.from(new Set(projects.map(p => p.type)));
  const uniqueLocations = Array.from(new Set(projects.map(p => p.location)));

  return (
    <div className="min-h-screen-mobile bg-background">
      <Navbar />
      <div className="pt-20 sm:pt-24 pb-16 sm:pb-24 px-4 sm:px-6 safe-area-inset-top safe-area-inset-bottom">
        <div className="max-w-7xl mx-auto">
          {/* Header - Mobile Optimized */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bebas font-bold text-foreground mb-2">
                Creative Projects
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground">
                Discover amazing projects and collaborate with talented creators
              </p>
            </div>
            
            {user && (
              <Button 
                onClick={() => setShowNewProjectForm(true)}
                className="w-full sm:w-auto bg-warm-gradient hover:shadow-warm text-white shadow-lg transition-all duration-300 min-h-[48px] touch-auto"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="font-medium">New Project</span>
              </Button>
            )}
          </div>

          {/* Filters - Mobile First Design */}
          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects, roles, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
            </div>
          </div>

          {/* Projects Grid - Mobile Optimized */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-muted rounded-full w-16"></div>
                        <div className="h-6 bg-muted rounded-full w-20"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4">No projects found</h3>
                <p className="text-muted-foreground mb-8">
                  Try adjusting your search criteria or create a new project to get started.
                </p>
                {user && (
                  <Button 
                    onClick={() => setShowNewProjectForm(true)}
                    className="bg-warm-gradient hover:shadow-warm text-white min-h-[48px] touch-auto"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Project
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="group border-0 glass-warm hover:shadow-warm transition-all duration-500 hover:-translate-y-2 card-hover touch-auto">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="text-xs bg-amber-100/50 text-amber-800 border-amber-200/50">
                        {project.type}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {project.timeline}
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl sm:text-2xl font-bebas group-hover:text-warm-gradient transition-all duration-300 leading-tight">
                      {project.title}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {project.location}
                      </div>
                      <div className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {project.deadline}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </CardDescription>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Roles Needed
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {project.rolesNeeded.slice(0, 3).map((role, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {project.rolesNeeded.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.rolesNeeded.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={project.postedByAvatar} />
                            <AvatarFallback className="text-xs">
                              {getAnimalEmojiForUser(project.postedById)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate max-w-[120px]">
                            {project.postedBy}
                          </span>
                        </div>
                        
                        <Link to={`/projects/${project.id}`}>
                          <Button 
                            size="sm" 
                            className="bg-warm-gradient hover:shadow-warm text-white group/btn transition-all duration-300 min-h-[36px] touch-auto"
                          >
                            <span className="text-xs font-medium">View</span>
                            <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* New Project Form */}
      <NewProjectForm 
        isOpen={showNewProjectForm}
        onClose={() => setShowNewProjectForm(false)}
        onProjectCreated={handleNewProject}
      />
      
      <Footer />
    </div>
  );
};

export default Projects;
