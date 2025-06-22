
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getConversations } from '@/lib/supabase/messages';
import { useAuth } from '@/contexts/AuthContext';
import { getAnimalAvatarForUser, getAnimalEmojiForUser } from '@/lib/animalAvatars';

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
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }
  
  if (conversations.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <MessageCircle className="h-16 w-16 mx-auto mb-6 text-amber-500/50" />
        <h3 className="text-xl font-semibold mb-3">No conversations yet</h3>
        <p className="text-muted-foreground text-base leading-relaxed">
          Your messages will appear here once you start chatting with creators
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUser = conversation.otherUser;
        if (!otherUser || !otherUser.id) {
          console.warn("Conversation missing otherUser or otherUser.id:", conversation);
          return null;
        }
        const animalAvatar = getAnimalAvatarForUser(otherUser.id);
        const animalEmoji = getAnimalEmojiForUser(otherUser.id);

        return (
          <Link
            key={otherUser.id}
            to={`/messages/${otherUser.id}`}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-amber-50/80 active:bg-amber-100/80 transition-all duration-200 border border-transparent hover:border-amber-200/50 hover:shadow-sm group touch-manipulation"
          >
            <div className="relative">
              <Avatar className="h-14 w-14 border-2 border-amber-200/50 group-hover:border-amber-300 transition-colors">
                <AvatarImage src={otherUser.avatar || animalAvatar} />
                <AvatarFallback className="text-lg font-semibold bg-warm-gradient text-white">
                  {animalEmoji}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator could go here */}
            </div>
            
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-base text-foreground group-hover:text-amber-700 transition-colors truncate">
                  {otherUser.name || 'Unknown User'}
                </h3>
                {conversation.created_at && (
                  <span className="text-xs text-muted-foreground font-medium flex-shrink-0 ml-2">
                    {new Date(conversation.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground truncate leading-relaxed">
                {conversation.content || 'Start a conversation...'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
