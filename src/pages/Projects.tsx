import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchProjects } from '@/lib/supabase/projects';
import { Project } from '@/lib/types';
import NewProjectForm from '@/components/projects/NewProjectForm';

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

  const getProjectStatus = (deadline: string): string => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    if (deadlineDate < now) {
      return 'Expired';
    }

    const timeLeft = deadlineDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeLeft / (1000 * 3600 * 24));

    if (daysLeft <= 7) {
      return 'Ending Soon';
    }

    return 'Open';
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">FILM PROJECTS</h1>
              <p className="text-muted-foreground">Find exciting film projects looking for collaborators</p>
            </div>
            
            {user && (
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0" size="lg">
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
          
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search projects..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <Select 
                value={locationFilter} 
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={roleFilter} 
                onValueChange={setRoleFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="flex flex-col hover:shadow-md transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      {getProjectStatus(project.deadline) !== 'Expired' && (
                        <Badge>{getProjectStatus(project.deadline)}</Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="mb-4">
                      <p className="line-clamp-3">{project.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Roles Needed:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.required_roles.map((role, idx) => (
                          <Badge key={idx} variant="outline">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Deadline: {formatDate(project.deadline)}</span>
                    </div>
                    {project.owner_id === user?.id ? (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        Manage
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        size="sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Details
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-secondary/40 p-6 rounded-full mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                {searchQuery || locationFilter !== 'all' || roleFilter !== 'all' ? 
                  'We couldn\'t find any projects matching your search criteria. Try adjusting your filters.' :
                  'There are no projects available at the moment. Check back later or create your own project.'}
              </p>
              
              {user && (searchQuery || locationFilter !== 'all' || roleFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('all');
                    setRoleFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
              
              {!user && (
                <div className="mt-6">
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="mr-4">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="lg">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Projects;
