
import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
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
      <div className="flex justify-center items-center h-full py-16">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
        <MessageCircle className="h-20 w-20 text-amber-500/50 mb-6" />
        <h3 className="text-xl font-semibold mb-3">No messages yet</h3>
        <p className="text-muted-foreground leading-relaxed max-w-sm">
          Send a message below to start your conversation
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 pb-4">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === user?.id;
        const senderAvatar = getAnimalAvatarForUser(message.senderId);
        
        return (
          <div 
            key={message.id} 
            className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            {!isCurrentUser && (
              <Avatar className="h-10 w-10 border-2 border-amber-200/50 flex-shrink-0">
                <AvatarImage src={message.sender?.avatar_url || senderAvatar} />
                <AvatarFallback className="bg-warm-gradient text-white font-semibold text-sm">
                  {getAnimalEmojiForUser(message.senderId)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div 
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                isCurrentUser 
                  ? 'bg-warm-gradient text-white rounded-br-md' 
                  : 'bg-white border border-amber-200/50 text-foreground rounded-bl-md'
              }`}
            >
              <p className="text-base leading-relaxed break-words">{message.content}</p>
              <p className={`text-xs mt-2 ${isCurrentUser ? 'text-white/80' : 'text-muted-foreground'}`}>
                {new Date(message.createdAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
            
            {isCurrentUser && (
              <Avatar className="h-10 w-10 border-2 border-amber-200/50 flex-shrink-0">
                <AvatarImage src={profile?.avatar_url || senderAvatar} />
                <AvatarFallback className="bg-warm-gradient text-white font-semibold text-sm">
                  {getAnimalEmojiForUser(user.id)}
                </AvatarFallback>
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
