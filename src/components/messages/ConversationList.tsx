
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getConversations } from '@/lib/supabase/messages';
import { useAuth } from '@/contexts/AuthContext';
import { getAnimalAvatarForUser, getAnimalEmojiForUser } from '@/lib/animalAvatars'; // Import emoji function

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
        // Ensure otherUser and its id exist before generating avatar/emoji
        if (!otherUser || !otherUser.id) {
          console.warn("Conversation missing otherUser or otherUser.id:", conversation);
          return null; // Skip rendering this conversation if data is incomplete
        }
        const animalAvatar = getAnimalAvatarForUser(otherUser.id);
        const animalEmoji = getAnimalEmojiForUser(otherUser.id); // Generate emoji using id

        return (
          <Link
            key={otherUser.id}
            to={`/messages/${otherUser.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Avatar>
              {/* Use animalAvatar as a fallback src if otherUser.avatar is null/undefined */}
              <AvatarImage src={otherUser.avatar || animalAvatar} />
              {/* Use animalEmoji directly */}
              <AvatarFallback>{animalEmoji}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                {/* Use otherUser.name */}
                <h3 className="font-medium">{otherUser.name || 'Unknown User'}</h3>
                {/* Ensure conversation.created_at exists */}
                {conversation.created_at && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              {/* Ensure conversation.content exists */}
              <p className="text-sm text-muted-foreground truncate">{conversation.content || ''}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
