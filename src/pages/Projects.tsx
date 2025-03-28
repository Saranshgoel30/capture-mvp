
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Categories for filtering
  const categories = ["All", "Documentary", "Short Film", "Music Video", "Podcast", "Marketing", "Photography"];

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
    const deadlineDate = new Date(deadline);
    const today = new Date();
    return deadlineDate >= today;
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
              {filteredProjects.map(project => (
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
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                        <img 
                          src={project.postedByAvatar || 'https://i.pravatar.cc/150?img=5'} 
                          alt={project.postedBy} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://i.pravatar.cc/150?img=5';
                          }}
                        />
                      </div>
                      <span className="text-sm">{project.postedBy}</span>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => navigate(`/projects/${project.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {!isLoading && filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-secondary/40 p-6 rounded-full mb-4">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-muted-foreground text-center max-w-md">
                We couldn't find any projects matching your search criteria. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
      
      {/* New Project Form Modal */}
      <NewProjectForm 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)} 
      />
    </div>
  );
};

export default Projects;
