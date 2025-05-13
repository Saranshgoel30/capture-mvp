
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

type MessagesContextType = {
  conversations: any[];
  refreshConversations: () => Promise<void>;
  selectedConversation: any | null;
  setSelectedConversation: (conversation: any | null) => void;
  messages: any[];
  loadingMessages: boolean;
  sendMessage: (receiverId: string, content: string) => Promise<boolean>;
  refreshMessages: (otherId: string) => Promise<void>;
  fetchConversations: () => Promise<void>;
};

const initialContext: MessagesContextType = {
  conversations: [],
  refreshConversations: async () => {},
  selectedConversation: null,
  setSelectedConversation: () => {},
  messages: [],
  loadingMessages: false,
  sendMessage: async () => false,
  refreshMessages: async () => {},
  fetchConversations: async () => {},
};

const MessageContext = createContext<MessagesContextType>(initialContext);

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchConversations = async () => {
    if (!user) {
      setConversations([]);
      return;
    }

    try {
      // Get all unique users the current user has exchanged messages with
      const { data: sentMessagesUsers, error: sentError } = await supabase
        .from('messages')
        .select('receiver_id')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessagesUsers, error: receivedError } = await supabase
        .from('messages')
        .select('sender_id')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (sentError || receivedError) {
        console.error('Error fetching conversations:', sentError || receivedError);
        return;
      }

      // Extract unique user IDs
      const uniqueUserIds = new Set<string>();
      
      sentMessagesUsers?.forEach(msg => uniqueUserIds.add(msg.receiver_id));
      receivedMessagesUsers?.forEach(msg => uniqueUserIds.add(msg.sender_id));
      
      // Convert Set to Array
      const userIdsArray = Array.from(uniqueUserIds);
      
      if (userIdsArray.length === 0) {
        setConversations([]);
        return;
      }
      
      // Fetch user profiles for these IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIdsArray);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // For each profile, get the most recent message
      const conversationsWithLastMessage = await Promise.all(
        profiles.map(async (profile) => {
          // Get the most recent message between the current user and this profile
          const { data: latestMessages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (msgError) {
            console.error(`Error fetching latest message for ${profile.id}:`, msgError);
            return {
              ...profile,
              lastMessage: null,
              lastMessageTime: null
            };
          }
          
          const lastMessage = latestMessages && latestMessages.length > 0 ? latestMessages[0] : null;
          
          return {
            ...profile,
            lastMessage: lastMessage?.content || null,
            lastMessageTime: lastMessage?.created_at || null,
            isOutgoing: lastMessage?.sender_id === user.id
          };
        })
      );
      
      // Sort by most recent message
      const sortedConversations = conversationsWithLastMessage.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });
      
      setConversations(sortedConversations);
    } catch (error) {
      console.error('Exception fetching conversations:', error);
    }
  };

  const refreshMessages = async (otherId: string) => {
    if (!user || !otherId) return;
    
    setLoadingMessages(true);
    
    try {
      // Get messages between the current user and the selected user
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${otherId},receiver_id.eq.${otherId}`)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      
      // Filter to only include messages between these two users
      const filteredMessages = data.filter(
        msg => (msg.sender_id === user.id && msg.receiver_id === otherId) || 
               (msg.sender_id === otherId && msg.receiver_id === user.id)
      );
      
      setMessages(filteredMessages);
    } catch (error) {
      console.error('Exception fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          content: content.trim()
        })
        .select()
        .maybeSingle();
        
      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error sending message',
          description: error.message,
          variant: 'destructive'
        });
        return false;
      }
      
      // Add the new message to the state
      setMessages(prev => [...prev, data]);
      
      // Refresh conversations to update the last message
      await fetchConversations();
      
      return true;
    } catch (error) {
      console.error('Exception sending message:', error);
      toast({
        title: 'Error sending message',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
      return false;
    }
  };

  const refreshConversations = async () => {
    try {
      await fetchConversations();
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConversations()
        .catch(error => {
          console.error('Error in fetchConversations effect:', error);
        });
      
      // Set up realtime subscription for new messages
      const messagesSubscription = supabase
        .channel('messages_channel')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`
          },
          (payload) => {
            // Update messages if the conversation is currently open
            if (selectedConversation && 
               (payload.new.sender_id === selectedConversation.id || 
                payload.new.receiver_id === selectedConversation.id)) {
              setMessages(prev => [...prev, payload.new]);
            }
            
            // Refresh conversations to update the last message
            fetchConversations()
              .catch(error => {
                console.error('Error refreshing conversations after real-time update:', error);
              });
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(messagesSubscription);
      };
    }
  }, [user, selectedConversation]);

  return (
    <MessageContext.Provider
      value={{
        conversations,
        refreshConversations,
        selectedConversation,
        setSelectedConversation,
        messages,
        loadingMessages,
        sendMessage,
        refreshMessages,
        fetchConversations
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
