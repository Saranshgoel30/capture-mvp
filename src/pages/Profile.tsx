import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Link as LinkIcon, Image as ImageIcon, FileVideo } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from '@/hooks/useProfileData';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PortfolioSection from '@/components/profile/PortfolioSection';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const isCurrentUser = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  const { 
    portfolioProjects, 
    currentProjects, 
    portfolioLoading,
    refreshPortfolio
  } = useProfileData(targetUserId);

  const profileData = {
    name: 'John Doe',
    handle: '@johndoe',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Software Engineer | Film Enthusiast | Music Lover',
    location: 'San Francisco, CA',
    roles: ['Director', 'Cinematographer', 'Editor'],
    skills: ['Filmmaking', 'Photography', 'Video Editing'],
    contact: {
      email: 'john.doe@example.com',
      instagram: 'johndoe',
      website: 'johndoe.com',
    },
    stats: {
      followers: 150,
      following: 200,
      projects: 30,
    },
  };

  return (
    <div>
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={profileData.avatar} alt={profileData.name} />
                    <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profileData.name}</CardTitle>
                    <CardDescription className="text-gray-500">{profileData.handle}</CardDescription>
                  </div>
                </div>
                {isCurrentUser && (
                  <Button variant="outline" size="sm">
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-gray-700">{profileData.bio}</p>
                <p className="text-gray-500">{profileData.location}</p>
              </div>
              <div className="flex space-x-4">
                <div>
                  <p className="text-sm font-semibold">Followers</p>
                  <p className="text-gray-700">{profileData.stats.followers}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Following</p>
                  <p className="text-gray-700">{profileData.stats.following}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">Projects</p>
                  <p className="text-gray-700">{profileData.stats.projects}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {profileData && (
            <PortfolioSection 
              portfolioProjects={portfolioProjects} 
              isLoading={portfolioLoading}
              isCurrentUser={isCurrentUser}
              onRefresh={refreshPortfolio}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
