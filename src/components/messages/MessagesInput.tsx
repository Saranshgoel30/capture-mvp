
// Update your MessagesInput component to include optimistic updates

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid'; // Add this dependency if not already installed

interface MessagesInputProps {
  receiverId: string;
}

const MessagesInput: React.FC<MessagesInputProps> = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !user) return;
    
    // Create optimistic message
    const tempId = uuidv4();
    const optimisticMessage = {
      id: tempId,
      content: message.trim(),
      senderId: user.id,
      receiverId: receiverId,
      createdAt: Date.now(),
      sender_id: user.id,
      receiver_id: receiverId,
      created_at: new Date().toISOString(),
      sender: {
        full_name: profile?.full_name,
        avatar_url: profile?.avatar_url
      }
    };
    
    // Add to local messages via context or parent component
    // This depends on how you're managing message state
    // For example, if using a context:
    // messageContext.addMessage(optimisticMessage);
    
    // Or via a callback prop:
    // onSendMessage(optimisticMessage);
    
    // Clear input immediately
    setMessage('');
    
    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: message.trim(),
          sender_id: user.id,
          receiver_id: receiverId
        });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Restore message to input
      setMessage(message);
      // Remove optimistic message
      // messageContext.removeMessage(tempId);
      
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex w-full gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
        disabled={isSending}
        // Add this for better mobile experience
        autoComplete="off"
      />
      <Button type="submit" disabled={isSending || !message.trim()}>
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="ml-2 hidden sm:inline">Send</span>
      </Button>
    </form>
  );
};

export default MessagesInput;
