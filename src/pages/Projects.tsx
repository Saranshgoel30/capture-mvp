
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Users, Filter, Search, Plus } from 'lucide-react';

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data for projects
  const projects = [
    {
      id: 1,
      title: "Feature Documentary on Urban Wildlife",
      type: "Documentary",
      description: "Looking for a skilled cinematographer and sound recordist to help capture footage of wildlife in urban environments for a documentary about adaptation and coexistence.",
      location: "New York City",
      timeline: "Aug - Oct 2023",
      rolesNeeded: ["Cinematographer", "Sound Recordist", "Editor"],
      postedBy: "Emma Chen",
      postedByAvatar: "https://i.pravatar.cc/150?img=5",
      deadline: "July 30, 2023",
      applicants: 8
    },
    {
      id: 2,
      title: "Experimental Short Film",
      type: "Short Film",
      description: "Seeking actors and a director of photography for an experimental short exploring themes of isolation and connection in a post-digital world.",
      location: "Los Angeles",
      timeline: "Sept 2023",
      rolesNeeded: ["Actor (2)", "Director of Photography", "Production Designer"],
      postedBy: "Marcus Liu",
      postedByAvatar: "https://i.pravatar.cc/150?img=8",
      deadline: "August 15, 2023",
      applicants: 12
    },
    {
      id: 3,
      title: "Music Video for Indie Band",
      type: "Music Video",
      description: "Looking for a creative director and choreographer for an indie rock band's music video with a surrealist dance concept.",
      location: "Austin, TX",
      timeline: "Aug 15-20, 2023",
      rolesNeeded: ["Director", "Choreographer", "Dancer (4)"],
      postedBy: "The Midnight Echo",
      postedByAvatar: "https://i.pravatar.cc/150?img=12",
      deadline: "August 5, 2023",
      applicants: 6
    },
    {
      id: 4,
      title: "Podcast Series About Local Artists",
      type: "Podcast",
      description: "Seeking an audio engineer and producer for a new podcast series featuring interviews with local artists across various disciplines.",
      location: "Remote",
      timeline: "Ongoing (weekly)",
      rolesNeeded: ["Audio Engineer", "Producer", "Graphic Designer"],
      postedBy: "Alex Rivera",
      postedByAvatar: "https://i.pravatar.cc/150?img=20",
      deadline: "Open until filled",
      applicants: 4
    },
    {
      id: 5,
      title: "Social Media Campaign for Art Exhibition",
      type: "Marketing",
      description: "Looking for photographers and videographers to create content for a major art exhibition's social media campaign.",
      location: "Chicago",
      timeline: "Aug - Sept 2023",
      rolesNeeded: ["Photographer", "Videographer", "Social Media Manager"],
      postedBy: "Contemporary Arts Center",
      postedByAvatar: "https://i.pravatar.cc/150?img=23",
      deadline: "July 25, 2023",
      applicants: 9
    },
    {
      id: 6,
      title: "Short Documentary on Local Craftspeople",
      type: "Documentary",
      description: "Seeking a director and camera operator for a short documentary series highlighting traditional craftspeople in our community.",
      location: "Portland, OR",
      timeline: "Sept - Oct 2023",
      rolesNeeded: ["Director", "Camera Operator", "Sound Recordist"],
      postedBy: "Craft Heritage Foundation",
      postedByAvatar: "https://i.pravatar.cc/150?img=32",
      deadline: "August 20, 2023",
      applicants: 3
    }
  ];

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.rolesNeeded.some(role => role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Categories for filtering
  const categories = ["All", "Documentary", "Short Film", "Music Video", "Podcast", "Marketing", "Photography"];

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
            <Button className="mt-4 md:mt-0 rounded-full">
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
            
            <Tabs defaultValue="All" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto py-2 mb-2">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="min-w-fit">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden flex flex-col h-full hover:shadow-md transition-all-200">
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
                        src={project.postedByAvatar} 
                        alt={project.postedBy} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm">{project.postedBy}</span>
                  </div>
                  <Button size="sm">View Details</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredProjects.length === 0 && (
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
    </div>
  );
};

export default Projects;
