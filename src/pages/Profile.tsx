
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProfileData } from '@/hooks/useProfileData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, MapPin, Link as LinkIcon, Loader2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    portfolioProjects, 
    currentProjects, 
    portfolioLoading, 
    currentProjectsLoading 
  } = useProfileData(userId || (user ? user.id : undefined));

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // If userId is provided, fetch that profile; otherwise, use the current user's profile
        if (userId) {
          const fetchedProfile = await fetchUserProfile(userId);
          setProfile(fetchedProfile);
        } else if (user) {
          // If no userId is provided, show the current user's profile
          setProfile(currentUserProfile);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId, user, currentUserProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">PROFILE NOT FOUND</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or isn't accessible.
            </p>
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Info */}
            <div className="md:w-1/3">
              <div className="rounded-2xl bg-secondary/40 backdrop-blur-md p-6">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="text-4xl">
                      <User size={48} />
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                  {profile.city && (
                    <div className="flex items-center mt-2 text-muted-foreground">
                      <MapPin size={16} className="mr-1" />
                      <span>{profile.city}</span>
                    </div>
                  )}
                </div>

                {profile.bio && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-muted-foreground">{profile.bio}</p>
                  </div>
                )}

                {profile.roles && profile.roles.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Roles</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.roles.map((role: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Projects */}
            <div className="md:w-2/3">
              {/* Current Projects */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Current Projects</h2>
                {currentProjectsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : currentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {currentProjects.map((project) => (
                      <Card key={project.id}>
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Role:</span> {project.role}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            <span className="font-medium">Timeline:</span> {project.timeline}
                          </p>
                          <p className="text-sm">{project.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No current projects</p>
                )}
              </div>

              {/* Portfolio */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Portfolio</h2>
                {portfolioLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : portfolioProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolioProjects.map((project) => (
                      <Card key={project.id}>
                        {project.thumbnail && (
                          <div className="aspect-video w-full overflow-hidden">
                            <img 
                              src={project.thumbnail} 
                              alt={project.title}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{project.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-2">
                            <span className="font-medium">Type:</span> {project.type}
                          </p>
                          <p className="text-sm">{project.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No portfolio items yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
