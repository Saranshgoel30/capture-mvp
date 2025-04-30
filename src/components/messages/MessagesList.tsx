
import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Message } from '@/lib/types';
import { getMessages, listenToMessages } from '@/lib/supabase/messages';
import { useAuth } from '@/contexts/AuthContext';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAnimalEmojiForUser } from '@/lib/animalAvatars';

interface MessagesListProps {
  otherId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({ otherId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!user || !otherId) return;
    
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const fetchedMessages = await getMessages(user.id, otherId);
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMessages();
    
    // Subscribe to real-time updates
    const subscription = listenToMessages(user.id, otherId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user, otherId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
        <p className="mb-2">No messages yet</p>
        <p className="text-sm">Send a message to start the conversation</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === user?.id;
        const senderAvatar = getAnimalAvatarForUser(message.senderId);
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={message.sender?.avatar_url || senderAvatar} />
                {/* Use message.senderId here */}
                <AvatarFallback>{getAnimalEmojiForUser(message.senderId)}</AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                isCurrentUser 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-80 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {isCurrentUser && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarImage src={profile?.avatar_url || senderAvatar} />
                 {/* Use user.id here */}
                <AvatarFallback>{getAnimalEmojiForUser(user.id)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
