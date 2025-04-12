import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  sender?: {
    full_name?: string;
    avatar_url?: string | null;
  };
}

interface MessageContextType {
  messages: Record<string, Message[]>; // Keyed by conversation ID
  addMessage: (conversationId: string, message: Message) => void;
  removeMessage: (conversationId: string, messageId: string) => void;
  loadMessages: (userId: string) => Promise<void>;
  isLoading: boolean;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addMessage = (conversationId: string, message: Message) => {
    // Check if message already exists to prevent duplicates
    setMessages(prev => {
      const existingMessages = prev[conversationId] || [];
      const messageExists = existingMessages.some(m => m.id === message.id);
      
      if (messageExists) {
        return prev; // Don't add duplicate message
      }
      
      return {
        ...prev,
        [conversationId]: [...existingMessages, message]
      };
    });
  };

  const removeMessage = (conversationId: string, messageId: string) => {
    setMessages(prev => {
      const existingConversation = prev[conversationId];
      
      if (!existingConversation) {
        return prev;
      }
      
      return {
        ...prev,
        [conversationId]: existingConversation.filter(m => m.id !== messageId)
      };
    });
  };

  const loadMessages = async (userId: string) => {
    if (!user) return;
    
    const conversationId = [user.id, userId].sort().join('_');
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at');
      
      if (error) throw error;
      
      // Process messages to include sender info
      const processedMessages = await Promise.all((data || []).map(async (message) => {
        // If user is the sender, use their profile
        if (message.sender_id === user.id) {
          return {
            ...message,
            sender: {
              full_name: user.user_metadata?.full_name || 'You',
              avatar_url: user.user_metadata?.avatar_url
            }
          };
        }
        
        // Otherwise fetch the sender's profile
        try {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', message.sender_id)
            .single();
            
          if (senderError) throw senderError;
          
          return {
            ...message,
            sender: {
              full_name: senderData?.full_name || 'Unknown',
              avatar_url: senderData?.avatar_url
            }
          };
        } catch (err) {
          console.error('Error fetching sender:', err);
          return message;
        }
      }));
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: processedMessages
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `sender_id=eq.${user.id}` 
      }, (payload) => {
        // Handle your own messages (for confirmation)
        const message = payload.new as Message;
        const conversationId = [user.id, message.receiver_id].sort().join('_');
        
        // Add your own message to the conversation
        addMessage(conversationId, {
          ...message,
          sender: {
            full_name: user.user_metadata?.full_name || 'You',
            avatar_url: user.user_metadata?.avatar_url
          }
        });
      })
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${user.id}` 
      }, (payload) => {
        // Handle incoming messages
        const message = payload.new as Message;
        const conversationId = [user.id, message.sender_id].sort().join('_');
        
        // Fetch sender details
        try {
          supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', message.sender_id)
            .single()
            .then(({ data, error }) => {
              if (!error && data) {
                addMessage(conversationId, {
                  ...message,
                  sender: {
                    full_name: data.full_name || 'Unknown',
                    avatar_url: data.avatar_url
                  }
                });
              } else {
                addMessage(conversationId, {
                  ...message,
                  sender: {
                    full_name: 'Unknown',
                    avatar_url: null
                  }
                });
              }
            })
            .catch(err => {
              console.error('Error fetching sender details:', err);
              addMessage(conversationId, {
                ...message,
                sender: {
                  full_name: 'Unknown',
                  avatar_url: null
                }
              });
            });
        } catch (outerErr) {
          console.error('Outer error in sender fetch:', outerErr);
          addMessage(conversationId, {
            ...message,
            sender: {
              full_name: 'Unknown',
              avatar_url: null
            }
          });
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  return (
    <MessageContext.Provider value={{ messages, addMessage, removeMessage, loadMessages, isLoading }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};