
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Plus, Filter, Grid3X3, List, Loader2, Briefcase, Clock, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects } from '@/lib/supabase/projects';
import { Project } from '@/lib/types';
import NewProjectForm from '@/components/projects/NewProjectForm';
import FadeIn from '@/components/ui-custom/FadeIn';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
  const [uniqueRoles, setUniqueRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    // Extract unique locations and roles
    const locations = ['all', ...new Set(projects.map(project => project.location))];
    const roles = ['all', ...new Set(projects.flatMap(project => project.required_roles))];

    setUniqueLocations(locations);
    setUniqueRoles(roles);
  }, [projects]);

  useEffect(() => {
    let filtered = [...projects];

    // Apply search query filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(project => project.location === locationFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(project => project.required_roles.includes(roleFilter));
    }

    setFilteredProjects(filtered);
  }, [searchQuery, locationFilter, roleFilter, projects]);

  const formatDate = (date: string): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString(undefined, options);
  };

  const getProjectStatus = (deadline: string): { status: string; variant: "default" | "secondary" | "destructive" | "outline" } => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate < now) {
      return { status: 'Expired', variant: 'destructive' };
    }

    const timeLeft = deadlineDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

    if (daysLeft <= 7) {
      return { status: 'Ending Soon', variant: 'secondary' };
    }

    return { status: 'Open', variant: 'default' };
  };

  const refreshProjects = async () => {
    setIsLoading(true);
    try {
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error refreshing projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const ProjectCard = ({ project }: { project: Project }) => {
    const projectStatus = getProjectStatus(project.deadline);
    
    return (
      <Card className="group hover:shadow-warm transition-all duration-500 hover:-translate-y-2 glass border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex justify-between items-start mb-3">
            <CardTitle className="text-xl font-bebas tracking-wide group-hover:text-amber-700 transition-colors duration-300 line-clamp-2">
              {project.title}
            </CardTitle>
            <Badge variant={projectStatus.variant} className="ml-2 flex-shrink-0">
              {projectStatus.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-amber-600/70">
            <div className="flex items-center gap-1">
              <MapPin size={14} className="flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="flex-shrink-0" />
              <span className="truncate">{formatDate(project.deadline)}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {project.description}
          </p>
          
          <div>
            <h4 className="text-xs font-semibold text-amber-700 mb-2 uppercase tracking-wider">Roles Needed</h4>
            <div className="flex flex-wrap gap-1.5">
              {project.required_roles.slice(0, 3).map((role, idx) => (
                <Badge key={idx} variant="outline" className="text-xs bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                  {role}
                </Badge>
              ))}
              {project.required_roles.length > 3 && (
                <Badge variant="outline" className="text-xs">+{project.required_roles.length - 3} more</Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="relative border-t border-amber-100/50 bg-gradient-to-r from-amber-50/30 to-orange-50/30 backdrop-blur-sm">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-3 text-sm text-amber-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span className="text-xs opacity-75">Due {formatDate(project.deadline)}</span>
              </div>
            </div>
            
            {project.owner_id === user?.id ? (
              <Button 
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-600 hover:bg-amber-50"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                Manage
              </Button>
            ) : (
              <Button 
                size="sm"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                View Details
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 opacity-50" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        
        <div className="max-w-7xl mx-auto relative">
          <FadeIn>
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-200/50">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Find Opportunities</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas tracking-wider mb-4">
                <span className="block text-foreground">FILM</span>
                <span className="block text-warm-gradient">PROJECTS</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover exciting film projects and collaborate with talented creators from around the world
              </p>
            </div>
          </FadeIn>
          
          {/* Search and Filters */}
          <FadeIn delay={0.2}>
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500 h-5 w-5" />
                <Input 
                  placeholder="Search projects by title, description..." 
                  className="pl-12 pr-4 py-4 text-lg glass border-amber-200/50 focus:border-amber-400 rounded-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-amber-600" />
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="w-[180px] glass border-amber-200/50 focus:border-amber-400">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.filter(loc => loc !== 'all').map((location) => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px] glass border-amber-200/50 focus:border-amber-400">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {uniqueRoles.filter(role => role !== 'all').map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="text-sm text-amber-600 font-medium">
                    {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 p-1 glass rounded-lg border border-amber-200/50">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-amber-600'}
                    >
                      <Grid3X3 size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-amber-600'}
                    >
                      <List size={16} />
                    </Button>
                  </div>
                  
                  {user && (
                    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                          <Plus className="mr-2 h-4 w-4" /> Create Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[800px]">
                        <DialogHeader>
                          <DialogTitle>Create New Project</DialogTitle>
                          <DialogDescription>
                            Fill out the details to post your film project and find collaborators.
                          </DialogDescription>
                        </DialogHeader>
                        <NewProjectForm 
                          isOpen={showCreateForm} 
                          onClose={() => setShowCreateForm(false)} 
                          onProjectCreated={refreshProjects}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
      
      {/* Content Section */}
      <section className="pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full animate-pulse"></div>
                  <Loader2 className="h-8 w-8 text-amber-600 animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-amber-600 font-medium">Loading amazing projects...</p>
              </div>
            </FadeIn>
          )}
          
          {/* Projects Grid */}
          {!isLoading && filteredProjects.length > 0 && (
            <FadeIn delay={0.3}>
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
                {filteredProjects.map((project, index) => (
                  <FadeIn key={project.id} delay={0.1 * (index % 9)}>
                    <ProjectCard project={project} />
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          )}
          
          {/* Empty State */}
          {!isLoading && filteredProjects.length === 0 && (
            <FadeIn>
              <div className="flex flex-col items-center justify-center py-20 space-y-6">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                  <Search className="h-12 w-12 text-amber-400" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bebas tracking-wide text-amber-700">No Projects Found</h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery || locationFilter !== 'all' || roleFilter !== 'all' ? 
                      'We couldn\'t find any projects matching your search criteria. Try adjusting your filters.' :
                      'There are no projects available at the moment. Check back later or create your own project.'}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  {(searchQuery || locationFilter !== 'all' || roleFilter !== 'all') && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery('');
                        setLocationFilter('all');
                        setRoleFilter('all');
                      }}
                      className="border-amber-300 text-amber-600 hover:bg-amber-50"
                    >
                      Clear Filters
                    </Button>
                  )}
                  
                  {!user && (
                    <div className="flex gap-4">
                      <Link to="/login">
                        <Button variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup">
                        <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Projects;
