
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, MessageSquare, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import { fetchUserProfile } from '@/lib/supabase/users';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioSection from '@/components/profile/PortfolioSection';
import { useToast } from "@/components/ui/use-toast";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isCurrentUser = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { 
    portfolioProjects, 
    currentProjects, 
    portfolioLoading,
    refreshPortfolio
  } = useProfileData(targetUserId);

  useEffect(() => {
    const loadProfile = async () => {
      if (!targetUserId) return;
      
      try {
        setLoading(true);
        const data = await fetchUserProfile(targetUserId);
        setProfileData(data);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [targetUserId, toast]);

  const handleMessageClick = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to message this creator',
        variant: 'destructive'
      });
      navigate('/login');
      return;
    }

    if (isCurrentUser) {
      navigate('/messages');
    } else {
      navigate(`/messages/${targetUserId}`);
    }
  };

  // Generate a random animal for avatar fallback
  const getRandomAnimal = () => {
    const animals = ['🦊', '🐼', '🦁', '🐯', '🦄', '🐶', '🐱', '🦊', '🐻', '🐨'];
    return animals[Math.floor(Math.random() * animals.length)];
  };

  // Fallback profile data
  const defaultProfile = {
    full_name: 'Anonymous Creator',
    roles: ['Creator'],
    skills: ['Filmmaking'],
    city: 'Somewhere',
    bio: 'No bio available',
    avatar_url: null
  };

  const profile = profileData || defaultProfile;
  const animalEmoji = getRandomAnimal();

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-300 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/5"></div>
                </div>
              </div>
              <div className="h-24 bg-gray-300 rounded"></div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-16 h-16 mr-4">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
                      {animalEmoji}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                    <CardDescription className="text-gray-500 flex items-center mt-1">
                      {profile.city && (
                        <>
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{profile.city}</span>
                        </>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!isCurrentUser && (
                    <Button variant="default" onClick={handleMessageClick}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  )}
                  {isCurrentUser && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700">{profile.bio || "No bio available."}</p>
              </div>
              
              {(profile.roles?.length > 0 || profile.skills?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.roles?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Roles</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.roles.map((role: string, index: number) => (
                          <Badge key={index} variant="secondary">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {profile.skills?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-muted-foreground">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="portfolio" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio">
              {profileData && (
                <PortfolioSection 
                  portfolioProjects={portfolioProjects} 
                  isLoading={portfolioLoading}
                  isCurrentUser={isCurrentUser}
                  onRefresh={refreshPortfolio}
                />
              )}
            </TabsContent>
            
            <TabsContent value="experience">
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold">Experience</h2>
                </div>
                
                {currentProjects && currentProjects.length > 0 ? (
                  <div className="space-y-6">
                    {currentProjects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{project.title}</h3>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                                  {project.role}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                                  {project.timeline}
                                </div>
                              </div>
                              <p className="mt-3">{project.description}</p>
                            </div>
                            <Badge variant="outline">{project.status}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 text-center">
                    <h3 className="text-xl font-semibold mb-2">No experience listed yet</h3>
                    <p className="text-muted-foreground">
                      {isCurrentUser 
                        ? "Add your experience to showcase your work history to potential collaborators."
                        : "This user hasn't added any experience yet."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
