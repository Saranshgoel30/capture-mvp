
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, ArrowLeft, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProfile } from '@/lib/supabase/users';
import ProfileImage from '@/components/profile/ProfileImage';
import MessagesList from '@/components/messages/MessagesList';
import MessagesInput from '@/components/messages/MessagesInput';
import ConversationList from '@/components/messages/ConversationList';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useIsMobile } from '@/hooks/use-mobile';

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoadingUser, setErrorLoadingUser] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!user || !userId) {
      setOtherUser(null);
      setErrorLoadingUser(null);
      setIsLoading(false);
      return;
    }

    const loadOtherUser = async () => {
      setIsLoading(true);
      setErrorLoadingUser(null);
      try {
        const profile = await fetchUserProfile(userId);
        if (!profile) {
          throw new Error("User profile not found.");
        }
        setOtherUser(profile);
        if (isMobile) {
          setShowConversations(false); // Hide conversations on mobile when viewing a chat
        }
      } catch (error: any) {
        console.error('Error loading user profile:', error);
        setErrorLoadingUser(error.message || 'Failed to load user profile.');
        setOtherUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadOtherUser();
  }, [user, userId, isMobile]);

  // Handle mobile navigation
  useEffect(() => {
    if (isMobile) {
      setShowConversations(!userId);
    } else {
      setShowConversations(true);
    }
  }, [userId, isMobile]);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-4 sm:px-6 md:px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">Please Login</h1>
              <p className="text-lg text-muted-foreground mb-8">You need to be logged in to access messages.</p>
              <Link to="/login">
                <Button size="lg" className="bg-warm-gradient hover:shadow-warm text-white px-8 py-4 text-lg font-semibold rounded-xl">
                  Login to Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 sm:pt-32 pb-6 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
          
          {/* Mobile: Show either conversations or chat */}
          {isMobile ? (
            <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-200px)]">
              {showConversations ? (
                // Mobile Conversations View
                <Card className="h-full flex flex-col shadow-lg">
                  <CardHeader className="pb-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                    <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                      <MessageCircle className="h-6 w-6 text-amber-600" />
                      Your Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-y-auto p-4">
                    <ConversationList />
                  </CardContent>
                </Card>
              ) : userId ? (
                // Mobile Chat View
                <Card className="h-full flex flex-col shadow-lg">
                  {isLoading ? (
                    <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConversations(true)}
                          className="p-2 hover:bg-amber-100 rounded-full"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <CardTitle className="text-lg">Loading...</CardTitle>
                      </div>
                    </CardHeader>
                  ) : errorLoadingUser ? (
                    <CardHeader className="border-b">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConversations(true)}
                          className="p-2 hover:bg-amber-100 rounded-full"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Alert variant="destructive" className="flex-1">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>{errorLoadingUser}</AlertDescription>
                        </Alert>
                      </div>
                    </CardHeader>
                  ) : otherUser ? (
                    <>
                      <CardHeader className="flex flex-row items-center gap-3 pb-3 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConversations(true)}
                          className="p-2 hover:bg-amber-100 rounded-full"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <ProfileImage
                          avatar={otherUser.avatar_url}
                          name={otherUser.full_name}
                          userId={userId}
                          size="sm"
                          readOnly
                        />
                        <CardTitle className="text-lg font-semibold">
                          {otherUser.full_name || 'Creator'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-4">
                        <MessagesList otherId={userId} />
                      </CardContent>
                      <div className="p-4 border-t bg-gray-50/50">
                        <MessagesInput receiverId={userId} />
                      </div>
                    </>
                  ) : null}
                  
                  {errorLoadingUser && !isLoading && (
                    <CardContent className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
                      <div>
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                        <p className="text-lg">Could not load conversation</p>
                        <Button
                          variant="outline"
                          onClick={() => setShowConversations(true)}
                          className="mt-4"
                        >
                          Back to Messages
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ) : null}
            </div>
          ) : (
            // Desktop: Show both conversations and chat side by side
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
              {/* Desktop Conversations sidebar */}
              <Card className="lg:col-span-1 flex flex-col h-full shadow-lg">
                <CardHeader className="pb-4 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <MessageCircle className="h-6 w-6 text-amber-600" />
                    Conversations
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-y-auto p-4">
                  <ConversationList />
                </CardContent>
              </Card>

              {/* Desktop Message thread */}
              {userId ? (
                <Card className="lg:col-span-2 h-full flex flex-col shadow-lg">
                  {isLoading ? (
                    <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <CardTitle className="text-xl">Loading User...</CardTitle>
                      </div>
                    </CardHeader>
                  ) : errorLoadingUser ? (
                    <CardHeader className="border-b">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorLoadingUser}</AlertDescription>
                      </Alert>
                    </CardHeader>
                  ) : otherUser ? (
                    <>
                      <CardHeader className="flex flex-row items-center gap-4 pb-3 border-b bg-gradient-to-r from-amber-50 to-orange-50">
                        <ProfileImage
                          avatar={otherUser.avatar_url}
                          name={otherUser.full_name}
                          userId={userId}
                          size="sm"
                          readOnly
                        />
                        <CardTitle className="text-xl font-semibold">
                          {otherUser.full_name || 'Creator'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto p-6">
                        <MessagesList otherId={userId} />
                      </CardContent>
                      <div className="p-4 border-t bg-gray-50/50">
                        <MessagesInput receiverId={userId} />
                      </div>
                    </>
                  ) : null}
                  
                  {errorLoadingUser && !isLoading && (
                    <CardContent className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
                      <div>
                        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
                        <p className="text-xl">Could not load conversation</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ) : (
                <Card className="lg:col-span-2 h-full flex items-center justify-center shadow-lg">
                  <div className="text-center p-8">
                    <MessageCircle className="h-20 w-20 mx-auto mb-6 text-amber-500" />
                    <h2 className="text-3xl font-bold mb-4">Select a Conversation</h2>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                      Choose a conversation from the list or start a new one by visiting a creator's profile.
                    </p>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Messages;
