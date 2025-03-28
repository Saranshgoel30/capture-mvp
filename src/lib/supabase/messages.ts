import { supabase } from './client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { fetchUserProfile } from './users';
import { Message } from '@/lib/types';

// Fetch messages between two users
export const getMessages = async (userId1: string, userId2: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at');
    
    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    
    // Enhance messages with sender info
    const enhancedMessages = await Promise.all(
      (data || []).map(async (message) => {
        const sender = await fetchUserProfile(message.sender_id);
        return {
          ...message,
          sender: {
            full_name: sender?.full_name || 'Unknown',
            avatar_url: sender?.avatar_url
          }
        };
      })
    );
    
    return enhancedMessages;
  } catch (error) {
    console.error('Exception fetching messages:', error);
    return [];
  }
};

// Send a message to another user
export const sendMessage = async (senderId: string, receiverId: string, content: string): Promise<Message | null> => {
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
export const listenToMessages = (userId1: string, userId2: string, callback: (message: Message) => void): RealtimeChannel => {
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
      async (payload) => {
        // Get sender info and add it to the message
        const sender = await fetchUserProfile(payload.new.sender_id);
        callback({
          ...payload.new as Message,
          sender: {
            full_name: sender?.full_name || 'Unknown',
            avatar_url: sender?.avatar_url
          }
        });
      }
    )
    .subscribe();
  
  return channel;
};

// Get recent conversations for a user
export const getConversations = async (userId: string) => {
  try {
    // Get all messages where the user is either sender or receiver
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Create a map to track the most recent message with each user
    const conversationsMap = new Map();
    
    for (const message of data) {
      const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      
      // Only keep the most recent message for each conversation
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, message);
      }
    }
    
    // Fetch profile details for each conversation partner
    const conversations = await Promise.all(
      Array.from(conversationsMap.entries()).map(async ([otherUserId, message]) => {
        const profile = await fetchUserProfile(otherUserId);
        
        return {
          ...message,
          otherUser: {
            id: otherUserId,
            name: profile?.full_name || 'Unknown',
            avatar: profile?.avatar_url
          }
        };
      })
    );
    
    return conversations;
  } catch (error) {
    console.error('Exception fetching conversations:', error);
    return [];
  }
};
