import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUserProfile } from '@/lib/firestore';
import { UserProfile } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Profile: React.FC = () => {
  const { userId } = useParams();
  const { user, userProfile: currentUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div>Loading profile...</div>
          ) : profile ? (
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">{profile.name}</h1>
              <p className="text-xl text-muted-foreground mb-8">@{profile.handle}</p>
              
              {/* Profile content will go here */}
              {profile.bio && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">Bio</h2>
                  <p>{profile.bio}</p>
                </div>
              )}
              
              {/* Display other profile information */}
            </div>
          ) : (
            <div>
              <h1 className="text-4xl md:text-5xl font-bebas tracking-wider mb-2">PROFILE NOT FOUND</h1>
              <p className="text-muted-foreground">
                The profile you're looking for doesn't exist or isn't accessible.
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
