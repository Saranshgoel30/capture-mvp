
import { supabase } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { fetchUserProfile } from './users';

// Fetch messages between two users
export const getMessages = async (userId1: string, userId2: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(full_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at');
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching messages:', error);
    return [];
  }
};

// Send a message to another user
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception sending message:', error);
    throw error;
  }
};

// Subscribe to new messages
export const listenToMessages = (userId1: string, userId2: string, callback: (message: any) => void) => {
  const channel = supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `or(and(sender_id=eq.${userId1},receiver_id=eq.${userId2}),and(sender_id=eq.${userId2},receiver_id=eq.${userId1}))`
      },
      (payload) => {
        // Get sender info and add it to the message
        const enhanceMessage = async () => {
          const sender = await fetchUserProfile(payload.new.sender_id);
          callback({
            ...payload.new,
            sender: {
              full_name: sender?.full_name,
              avatar_url: sender?.avatar_url
            }
          });
        };
        
        enhanceMessage();
      }
    )
    .subscribe();
  
  return channel;
};

// Get recent conversations for a user
export const getConversations = async (userId: string) => {
  try {
    // This is a complex query to get the most recent message from each conversation
    const { data, error } = await supabase
      .rpc('get_user_conversations', { user_id: userId });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
    
    // Fetch profile details for each conversation partner
    const conversationsWithProfiles = await Promise.all(
      data.map(async (conversation: any) => {
        const otherUserId = conversation.sender_id === userId 
          ? conversation.receiver_id 
          : conversation.sender_id;
        
        const profile = await fetchUserProfile(otherUserId);
        
        return {
          ...conversation,
          otherUser: {
            id: otherUserId,
            name: profile?.full_name || 'Unknown',
            avatar: profile?.avatar_url
          }
        };
      })
    );
    
    return conversationsWithProfiles;
  } catch (error) {
    console.error('Exception fetching conversations:', error);
    return [];
  }
};
