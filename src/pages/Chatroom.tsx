
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle>Capture Community Chat</CardTitle>
            </CardHeader>
            
            <ScrollArea className="h-[60vh]">
              <CardContent className="p-6">
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
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.user_id === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.user_id !== user.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.user?.avatar_url || ''} />
                            <AvatarFallback>
                              {message.user?.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className="max-w-[80%]">
                          <div className="flex items-baseline gap-2">
                            {message.user_id !== user.id && (
                              <span className="text-sm font-medium">
                                {message.user?.full_name || 'Anonymous'}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatTime(message.created_at)}
                            </span>
                          </div>
                          
                          <div
                            className={`rounded-lg px-4 py-2 mt-1 text-sm ${
                              message.user_id === user.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary'
                            }`}
                          >
                            {message.content}
                          </div>
                        </div>
                        
                        {message.user_id === user.id && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback>
                              {profile?.full_name?.charAt(0) || user.email?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </CardContent>
            </ScrollArea>
            
            <CardFooter className="p-4 border-t">
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
      <Footer />
    </div>
  );
};

export default Chatroom;
