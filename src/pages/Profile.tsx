
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchUserProfile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useProfileData } from '@/hooks/useProfileData';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button'; // Add missing import
import ProfileHeader from '@/components/profile/ProfileHeader';
import PortfolioSection from '@/components/profile/PortfolioSection';
import CurrentProjectsSection from '@/components/profile/CurrentProjectsSection';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, profile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
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
          setIsCurrentUser(user && user.id === userId);
        } else if (user) {
          // If no userId is provided, show the current user's profile
          setProfile(currentUserProfile);
          setIsCurrentUser(true);
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
              <ProfileHeader 
                profile={profile} 
                isCurrentUser={isCurrentUser} 
              />
            </div>

            {/* Projects */}
            <div className="md:w-2/3">
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="current">Current Projects</TabsTrigger>
                  {isCurrentUser && (
                    <TabsTrigger value="applications">Applications</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="portfolio" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Portfolio</h2>
                    {isCurrentUser && (
                      <Link to="/settings">
                        <Button variant="outline">Add Project</Button>
                      </Link>
                    )}
                  </div>
                  <PortfolioSection 
                    portfolioProjects={portfolioProjects} 
                    isLoading={portfolioLoading}
                    isCurrentUser={isCurrentUser} 
                  />
                </TabsContent>
                
                <TabsContent value="current" className="space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Current Projects</h2>
                    {isCurrentUser && (
                      <Link to="/projects">
                        <Button variant="outline">Find Projects</Button>
                      </Link>
                    )}
                  </div>
                  <CurrentProjectsSection 
                    currentProjects={currentProjects}
                    isLoading={currentProjectsLoading}
                    isCurrentUser={isCurrentUser}
                  />
                </TabsContent>
                
                {isCurrentUser && (
                  <TabsContent value="applications" className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">My Applications</h2>
                    <div className="bg-secondary/40 backdrop-blur-md rounded-xl p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                      <p className="text-muted-foreground">
                        You haven't applied to any projects yet.
                      </p>
                      <Link to="/projects" className="block mt-4">
                        <Button>Browse Projects</Button>
                      </Link>
                    </div>
                  </TabsContent>
                )}
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
