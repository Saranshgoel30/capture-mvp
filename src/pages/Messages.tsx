
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from 'lucide-react'; // Import AlertTriangle
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProfile } from '@/lib/supabase/users';
import ProfileImage from '@/components/profile/ProfileImage';
import MessagesList from '@/components/messages/MessagesList';
import MessagesInput from '@/components/messages/MessagesInput';
import ConversationList from '@/components/messages/ConversationList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoadingUser, setErrorLoadingUser] = useState<string | null>(null); // Add error state

  useEffect(() => {
    if (!user || !userId) {
      // Reset state if userId is not present
      setOtherUser(null);
      setErrorLoadingUser(null);
      setIsLoading(false); // Not loading if no userId
      return;
    }

    // Load the other user's profile
    const loadOtherUser = async () => {
      setIsLoading(true);
      setErrorLoadingUser(null); // Reset error before loading
      try {
        const profile = await fetchUserProfile(userId);
        if (!profile) {
          throw new Error("User profile not found.");
        }
        setOtherUser(profile);
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        setErrorLoadingUser(error.message || 'Failed to load user profile.'); // Set error message
        setOtherUser(null); // Ensure otherUser is null on error
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
    <div className="min-h-screen bg-background flex flex-col"> {/* Use flex-col for full height */}
      <Navbar />
      {/* Make main content area grow */}
      <div className="flex-grow pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto h-full">
          {/* Adjust grid height and structure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]"> {/* Adjust height calculation or use flex */}
            {/* Conversations sidebar */}
            <Card className="lg:col-span-1 flex flex-col h-full"> {/* Use flex and h-full */}
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              {/* Make content scrollable */}
              <CardContent className="flex-grow overflow-y-auto">
                <ConversationList />
              </CardContent>
            </Card>

            {/* Message thread */}
            {userId ? (
              <Card className="lg:col-span-2 h-full flex flex-col"> {/* Use h-full and flex-col */}
                {isLoading ? ( // Show loading state for the header
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <CardTitle className="text-lg">Loading User...</CardTitle>
                    </div>
                  </CardHeader>
                ) : errorLoadingUser ? ( // Show error state for the header
                  <CardHeader className="border-b">
                     <Alert variant="destructive" className="mb-0">
                       <AlertTriangle className="h-4 w-4" />
                       <AlertTitle>Error</AlertTitle>
                       <AlertDescription>{errorLoadingUser}</AlertDescription>
                     </Alert>
                  </CardHeader>
                ) : otherUser ? ( // Show user info if loaded successfully
                  <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
                    <ProfileImage
                      avatar={otherUser.avatar_url}
                      name={otherUser.full_name}
                      userId={userId} // Keep using userId from params here
                      size="sm"
                      readOnly
                    />
                    <CardTitle className="text-lg">
                      {otherUser.full_name || 'Creator'}
                    </CardTitle>
                  </CardHeader>
                ) : null /* Should not happen if loading/error handled */}

                {/* Only render message list/input if user loaded successfully */}
                {!isLoading && !errorLoadingUser && otherUser && (
                  <>
                    <CardContent className="flex-1 overflow-y-auto py-4">
                      <MessagesList otherId={userId} />
                    </CardContent>
                    <div className="p-4 border-t">
                      <MessagesInput receiverId={userId} />
                    </div>
                  </>
                )}
                 {/* Optional: Show a message if user loading failed in the content area too */}
                 {errorLoadingUser && !isLoading && (
                    <CardContent className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                      Could not load conversation.
                    </CardContent>
                 )}
              </Card>
            ) : (
              <Card className="lg:col-span-2 h-full flex items-center justify-center"> {/* Use h-full */}
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
