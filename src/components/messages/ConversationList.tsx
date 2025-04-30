
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getConversations } from '@/lib/supabase/messages';
import { useAuth } from '@/contexts/AuthContext';
import { getAnimalAvatarForUser } from '@/lib/animalAvatars';

const ConversationList = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const fetchedConversations = await getConversations(user.id);
        setConversations(fetchedConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
    
    // Refresh conversations at intervals
    const interval = setInterval(loadConversations, 30000);
    
    return () => clearInterval(interval);
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No conversations yet</p>
        <p className="text-sm mt-1">Your messages will appear here</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const otherUser = conversation.otherUser;
        const animalAvatar = getAnimalAvatarForUser(otherUser.id);
        
        return (
          <Link 
            key={otherUser.id} 
            to={`/messages/${otherUser.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Avatar>
              <AvatarImage src={otherUser.avatar || animalAvatar} />
              <AvatarFallback>{getAnimalEmojiForUser(otherUser.userId)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-width-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{otherUser.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(conversation.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{conversation.content}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
