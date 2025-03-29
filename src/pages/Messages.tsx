
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProfile } from '@/lib/supabase/users';
import ProfileImage from '@/components/profile/ProfileImage';
import MessagesList from '@/components/messages/MessagesList';
import MessagesInput from '@/components/messages/MessagesInput';
import ConversationList from '@/components/messages/ConversationList';

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !userId) return;
    
    // Load the other user's profile
    const loadOtherUser = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchUserProfile(userId);
        setOtherUser(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOtherUser();
  }, [user, userId]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please Login</h1>
            <p className="mb-6">You need to be logged in to access messages.</p>
            <Link to="/login">
              <Button>Login</Button>
            </Link>
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
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations sidebar */}
            <Card className="lg:col-span-1 h-[calc(80vh-300px)]">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <CardContent className="overflow-y-auto">
                <ConversationList />
              </CardContent>
            </Card>
            
            {/* Message thread */}
            {userId ? (
              <Card className="lg:col-span-2 h-[calc(80vh-300px)] flex flex-col">
                {otherUser ? (
                  <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
                    <ProfileImage 
                      avatar={otherUser.avatar_url} 
                      name={otherUser.full_name}
                      userId={userId}
                      size="sm"
                      readOnly
                    />
                    <CardTitle className="text-lg">
                      {otherUser.full_name || 'Creator'}
                    </CardTitle>
                  </CardHeader>
                ) : (
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <CardTitle className="text-lg">Loading...</CardTitle>
                    </div>
                  </CardHeader>
                )}
                
                <CardContent className="flex-1 overflow-y-auto py-4">
                  {userId && <MessagesList otherId={userId} />}
                </CardContent>
                
                <div className="p-4 border-t">
                  {userId && <MessagesInput receiverId={userId} />}
                </div>
              </Card>
            ) : (
              <Card className="lg:col-span-2 h-[calc(80vh-300px)] flex items-center justify-center">
                <div className="text-center p-6">
                  <h2 className="text-2xl font-bold mb-4">Select a Conversation</h2>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list or start a new one by visiting a creator's profile.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
