
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Mail, Instagram, Link as LinkIcon, MessageSquare, BookmarkPlus, ExternalLink, Calendar, Clock, Award } from "lucide-react";

const Profile: React.FC = () => {
  const [following, setFollowing] = useState(false);

  // Mock data for the profile
  const profile = {
    name: "Sophia Rivera",
    handle: "@sophiarivera",
    avatar: "https://i.pravatar.cc/300?img=37",
    location: "Los Angeles, CA",
    bio: "Cinematographer with a passion for visual storytelling. Specializing in low-light and documentary-style filming. Always looking to collaborate on projects with social impact.",
    roles: ["Cinematographer", "Director of Photography", "Camera Operator"],
    skills: ["Low-light filming", "Documentary", "Narrative", "Color grading", "Steadicam", "Drone operation"],
    contact: {
      email: "sophia@example.com",
      instagram: "@sophiacreates",
      website: "sophiarivera.com"
    },
    stats: {
      followers: 342,
      following: 156,
      projects: 24
    }
  };

  // Mock data for portfolio
  const portfolioProjects = [
    {
      id: 1,
      title: "Urban Light",
      type: "Short Film",
      thumbnail: "https://source.unsplash.com/random/600x400/?film",
      role: "Director of Photography",
      date: "June 2023",
      collaborators: ["Alex Chen (Director)", "Maya Wilson (Editor)"],
      description: "A short film exploring the contrast between natural and artificial light in urban environments. Shot on Arri Alexa with vintage Cooke lenses."
    },
    {
      id: 2,
      title: "Beneath the Surface",
      type: "Documentary",
      thumbnail: "https://source.unsplash.com/random/600x400/?documentary",
      role: "Cinematographer",
      date: "March 2023",
      collaborators: ["Sam Rodriguez (Director)", "Taylor Kim (Producer)"],
      description: "Environmental documentary about ocean conservation efforts in the Pacific. Shot over 3 months across multiple locations."
    },
    {
      id: 3,
      title: "Resonance",
      type: "Music Video",
      thumbnail: "https://source.unsplash.com/random/600x400/?music",
      role: "Camera Operator",
      date: "January 2023",
      collaborators: ["The Echoes (Band)", "Jamie Lee (Director)"],
      description: "Single-take music video shot on a stabilized rig, following the band through an abandoned warehouse."
    }
  ];

  // Mock data for projects
  const currentProjects = [
    {
      id: 1,
      title: "Shadows in Motion",
      role: "Cinematographer",
      timeline: "August - October 2023",
      status: "In Production",
      description: "Experimental dance film exploring movement and shadow."
    },
    {
      id: 2,
      title: "The Last Light",
      role: "Director of Photography",
      timeline: "October - December 2023",
      status: "Pre-Production",
      description: "Feature film set in the aftermath of a power grid failure."
    }
  ];

  // Mock data for past collaborations
  const pastCollaborations = [
    {
      name: "Jordan Taylor",
      role: "Director",
      avatar: "https://i.pravatar.cc/300?img=12",
      projects: 3
    },
    {
      name: "Elise Wong",
      role: "Producer",
      avatar: "https://i.pravatar.cc/300?img=25",
      projects: 2
    },
    {
      name: "Marcus Neal",
      role: "Sound Designer",
      avatar: "https://i.pravatar.cc/300?img=33",
      projects: 1
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-24">
        {/* Cover Photo */}
        <div className="h-60 bg-gradient-to-r from-primary/30 to-primary/10 relative">
          <div className="absolute bottom-4 right-4">
            <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm">
              <Camera size={16} className="mr-2" />
              Edit Cover
            </Button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="relative -mt-16 sm:-mt-24 mb-8 px-4 sm:px-0">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              <div className="relative">
                <Avatar className="h-32 w-32 ring-4 ring-background">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              <div className="mt-6 sm:mt-0 sm:flex-1 min-w-0">
                <div className="flex flex-col-reverse sm:flex-row sm:flex-wrap sm:justify-between gap-y-3">
                  <div>
                    <h1 className="text-3xl font-semibold truncate">{profile.name}</h1>
                    <p className="text-muted-foreground">{profile.handle}</p>
                    <div className="flex items-center mt-2">
                      <MapPin size={16} className="text-muted-foreground mr-1" />
                      <span className="text-sm text-muted-foreground">{profile.location}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button size="sm" variant="outline" className="rounded-full">
                      <MessageSquare size={16} className="mr-2" />
                      Message
                    </Button>
                    <Button 
                      size="sm" 
                      variant={following ? "outline" : "default"} 
                      className="rounded-full"
                      onClick={() => setFollowing(!following)}
                    >
                      {following ? "Following" : "Follow"}
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0">
            {/* Left Column - About & Contact */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{profile.bio}</p>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="px-2 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-muted-foreground" />
                    <span>{profile.contact.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Instagram size={18} className="mr-3 text-muted-foreground" />
                    <span>{profile.contact.instagram}</span>
                  </div>
                  <div className="flex items-center">
                    <LinkIcon size={18} className="mr-3 text-muted-foreground" />
                    <a href="#" className="text-primary hover:underline">{profile.contact.website}</a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-semibold">{profile.stats.followers}</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{profile.stats.following}</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{profile.stats.projects}</p>
                      <p className="text-sm text-muted-foreground">Projects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Past Collaborations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastCollaborations.map((collaborator, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                          <AvatarFallback>{collaborator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{collaborator.name}</p>
                          <p className="text-sm text-muted-foreground">{collaborator.role} • {collaborator.projects} project{collaborator.projects !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right Column - Portfolio & Projects */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="current">Current Projects</TabsTrigger>
                  <TabsTrigger value="available">Availability</TabsTrigger>
                </TabsList>
                
                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolioProjects.map(project => (
                      <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-all-300">
                        <div className="relative aspect-[16/9]">
                          <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-background/70 backdrop-blur-sm">
                              {project.type}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription>{project.role}</CardDescription>
                            </div>
                            <Button variant="ghost" size="icon">
                              <ExternalLink size={18} />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm mb-2 text-muted-foreground">
                            <Calendar size={14} className="mr-1" />
                            {project.date}
                          </div>
                          <p className="text-sm mb-3">{project.description}</p>
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-1">Collaborators:</h4>
                            <div className="text-sm text-muted-foreground">
                              {project.collaborators.map((collab, index) => (
                                <span key={index}>
                                  {collab}
                                  {index < project.collaborators.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Current Projects Tab */}
                <TabsContent value="current" className="mt-6">
                  <div className="space-y-6">
                    {currentProjects.map(project => (
                      <Card key={project.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription>{project.role}</CardDescription>
                            </div>
                            <Badge variant={project.status === "In Production" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm mb-4 text-muted-foreground">
                            <Clock size={14} className="mr-1" />
                            {project.timeline}
                          </div>
                          <p>{project.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Availability Tab */}
                <TabsContent value="available" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Availability Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="font-medium">Available for new projects</span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-2">Preferred Project Types:</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">Documentaries</Badge>
                            <Badge variant="outline">Short Films</Badge>
                            <Badge variant="outline">Music Videos</Badge>
                            <Badge variant="outline">Commercial</Badge>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Time Commitment:</h3>
                          <p className="text-muted-foreground">Available for part-time and short-term projects (1-3 months)</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Location Preferences:</h3>
                          <p className="text-muted-foreground">Los Angeles area or remote pre-production</p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium mb-2">Rate Information:</h3>
                          <p className="text-muted-foreground">Daily and project-based rates available. Please contact for details.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Awards & Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex">
                          <Award className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Best Cinematography</h4>
                            <p className="text-sm text-muted-foreground">Indie Film Festival 2022 - "Echoes of Silence"</p>
                          </div>
                        </div>
                        <div className="flex">
                          <Award className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
                          <div>
                            <h4 className="font-medium">Official Selection</h4>
                            <p className="text-sm text-muted-foreground">Los Angeles Documentary Film Festival 2023 - "Beneath the Surface"</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
