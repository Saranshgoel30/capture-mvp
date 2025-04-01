
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Users, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserProfile } from '@/lib/supabase/users';
import { supabase } from '@/lib/supabase/client';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string | null;
  };
}

const Chatroom: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('chatroom_messages')
          .select('*')
          .order('created_at')
          .limit(100);
        
        if (error) throw error;
        
        // Enhance messages with user info
        const enhancedMessages = await Promise.all(
          (data || []).map(async (message) => {
            const sender = await fetchUserProfile(message.user_id);
            return {
              ...message,
              sender: {
                full_name: sender?.full_name || 'Unknown',
                avatar_url: sender?.avatar_url
              }
            };
          })
        );
        
        setMessages(enhancedMessages);
      } catch (error) {
        console.error('Error loading chatroom messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('chatroom')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chatroom_messages'
        },
        async (payload) => {
          const newMessage = payload.new as ChatMessage;
          const sender = await fetchUserProfile(newMessage.user_id);
          
          setMessages(currentMessages => [...currentMessages, {
            ...newMessage,
            sender: {
              full_name: sender?.full_name || 'Unknown',
              avatar_url: sender?.avatar_url
            }
          }]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      const { error } = await supabase
        .from('chatroom_messages')
        .insert({
          content: newMessage.trim(),
          user_id: user.id
        });
      
      if (error) throw error;
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-24 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Please Login to Join the Chatroom</h1>
            <p className="mb-6">You need to be logged in to view and send messages.</p>
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
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(80vh-300px)] flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 border-b">
              <Users className="h-6 w-6" />
              <CardTitle className="text-lg">Community Chatroom</CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <p className="mb-2">No messages yet</p>
                  <p className="text-sm">Be the first to send a message!</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.user_id === user?.id;
                  const senderAvatar = getAnimalAvatarForUser(message.user_id);
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="flex flex-col items-center mr-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender?.avatar_url || senderAvatar} />
                            <AvatarFallback>
                              {message.sender?.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground mt-1 max-w-[80px] truncate">
                            {message.sender?.full_name}
                          </span>
                        </div>
                      )}
                      <div 
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-80 mt-1">
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {isCurrentUser && (
                        <div className="flex flex-col items-center ml-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || senderAvatar} />
                            <AvatarFallback>
                              {user.full_name?.charAt(0) || '?'}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground mt-1">
                            You
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isSending}
                  className="flex-1"
                />
                <Button type="submit" disabled={isSending || !newMessage.trim()}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Chatroom;
