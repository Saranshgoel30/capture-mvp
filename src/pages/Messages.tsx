
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getMessages, sendMessage, listenToMessages } from '@/lib/supabase/messages';
import { fetchUserProfile } from '@/lib/supabase/users';
import ProfileImage from '@/components/profile/ProfileImage';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

const Messages: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user || !userId) return;
    
    // Load the other user's profile
    const loadOtherUser = async () => {
      const profile = await fetchUserProfile(userId);
      setOtherUser(profile);
    };
    
    // Load messages
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessages(user.id, userId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOtherUser();
    loadMessages();
    
    // Subscribe to real-time updates
    const subscription = listenToMessages(user.id, userId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, userId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userId || !newMessage.trim()) return;
    
    setIsSending(true);
    try {
      await sendMessage(user.id, userId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
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
        <div className="max-w-4xl mx-auto">
          <Card className="h-[calc(100vh-300px)] flex flex-col">
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
            
            <CardContent className="flex-1 overflow-y-auto py-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <p className="mb-2">No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.sender_id === user.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs opacity-80 mt-1">
                          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
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

export default Messages;
