
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Send } from 'lucide-react';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars'; // Import the emoji function

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user?: {
    full_name?: string;
    avatar_url?: string | null;
  };
}

const Chatroom: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('public:chatroom_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chatroom_messages' 
      }, (payload) => {
        fetchUserForMessage(payload.new as ChatMessage);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Add pagination to fetchMessages
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      
      // Limit to last 50 messages initially
      const { data, error } = await supabase
        .from('chatroom_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        throw error;
      }
  
      // Reverse to show in chronological order
      const reversedData = [...data].reverse();
  
      // Now fetch user data for each message
      const messagesWithUsers = await Promise.all(
        reversedData.map(async (message) => {
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', message.user_id)
              .single();
            
            return {
              ...message,
              user: userError ? null : {
                full_name: userData?.full_name,
                avatar_url: userData?.avatar_url
              }
            };
          } catch {
            return {
              ...message,
              user: null
            };
          }
        })
      );
      
      setMessages(messagesWithUsers);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      setFetchError(error.message || 'Failed to load chat messages');
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserForMessage = async (message: ChatMessage) => {
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', message.user_id)
        .single();
      
      if (userError) throw userError;
      
      const enhancedMessage = {
        ...message,
        user: {
          full_name: userData?.full_name,
          avatar_url: userData?.avatar_url
        }
      };
      
      setMessages(prev => [...prev, enhancedMessage]);
    } catch (error) {
      console.error('Error fetching user for message:', error);
      // Still add message even if we can't get user details
      setMessages(prev => [...prev, message]);
    }
  };

  // Add optimistic updates for messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !user) return;
    
    // Create an optimistic message
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      user: {
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url
      }
    };
    
    // Add optimistic message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Clear input right away
    setNewMessage('');
    
    try {
      setIsSending(true);
      
      const { data, error } = await supabase
        .from('chatroom_messages')
        .insert({
          content: optimisticMessage.content,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Replace optimistic message with real one if needed
      // This step might be unnecessary with Supabase realtime as it will come through subscription
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setNewMessage(optimisticMessage.content); // Restore the message to input
      
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  // Improve subscription to be more efficient
  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages with a more efficient approach
    const subscription = supabase
      .channel('public:chatroom_messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chatroom_messages' 
      }, (payload) => {
        // Only add messages from other users (our messages are added optimistically)
        if (payload.new.user_id !== user?.id) {
          fetchUserForMessage(payload.new as ChatMessage);
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  // Add debounced typing indicator (optional)
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col"> {/* Ensure flex column layout */}
      <Navbar />
      <div className="flex-grow pt-20 pb-4 px-6 md:px-12 flex justify-center"> {/* Adjust padding and allow growth */}
        <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-10rem)]"> {/* Set height for chat area */}
          <Card className="shadow-lg flex-grow flex flex-col">
            <CardHeader className="bg-primary text-primary-foreground flex-shrink-0">
              <CardTitle>Capture Community Chat</CardTitle>
            </CardHeader>

            <ScrollArea className="flex-grow"> {/* Allow scroll area to grow */}
              <CardContent className="p-4 md:p-6"> {/* Adjust padding */}
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : fetchError ? (
                  <div className="text-center text-destructive py-12">
                    <p>Error: {fetchError}</p>
                    <Button onClick={fetchMessages} className="mt-4">
                      Try Again
                    </Button>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <p>No messages yet. Be the first to say hello!</p>
                  </div>
                ) : (
                  <div className="space-y-2"> {/* Reduce spacing slightly */}
                    {messages.map((message) => {
                      const isCurrentUser = message.user_id === user.id;
                      const senderName = message.user?.full_name || 'Anonymous';
                      const senderAvatarUrl = message.user?.avatar_url;
                      const currentUserAvatarUrl = profile?.avatar_url;
                      const senderEmoji = getAnimalEmojiForUser(message.user_id); // Get emoji for sender
                      const currentUserEmoji = getAnimalEmojiForUser(user.id); // Get emoji for current user

                      return (
                        <div
                          key={message.id}
                          className={`flex items-end gap-2 ${
                            isCurrentUser ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {/* Avatar for other users (left) */}
                          {!isCurrentUser && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={senderAvatarUrl || undefined} />
                              <AvatarFallback>{senderEmoji}</AvatarFallback> {/* Use emoji */}
                            </Avatar>
                          )}

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[75%] rounded-lg px-3 py-2 ${ // Adjusted padding
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground rounded-br-none' // WhatsApp style bubble
                                : 'bg-secondary text-secondary-foreground rounded-bl-none' // WhatsApp style bubble
                            }`}
                          >
                            {/* Sender Name (only for others) */}
                            {!isCurrentUser && (
                              <p className="text-xs font-semibold mb-1 text-primary"> {/* Optional: Color name */}
                                {senderName}
                              </p>
                            )}
                            {/* Message Content with Line Breaks */}
                            <p className="text-sm whitespace-pre-line break-words"> {/* Added whitespace-pre-line and break-words */}
                              {message.content}
                            </p>
                            {/* Timestamp */}
                            <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/80 text-right' : 'text-muted-foreground text-right'}`}> {/* Right align timestamp */}
                              {formatTime(message.created_at)}
                            </p>
                          </div>

                          {/* Avatar for current user (right) */}
                          {isCurrentUser && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={currentUserAvatarUrl || undefined} />
                              <AvatarFallback>{currentUserEmoji}</AvatarFallback> {/* Use emoji */}
                            </Avatar>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>
            </ScrollArea>

            <CardFooter className="p-4 border-t flex-shrink-0"> {/* Ensure footer doesn't shrink */}
              <form onSubmit={handleSendMessage} className="flex w-full gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSending || !newMessage.trim()}>
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">Send</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Footer removed or placed outside the flex container if needed */}
      {/* <Footer /> */}
    </div>
  );
};

export default Chatroom;
