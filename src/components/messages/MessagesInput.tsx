
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

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
    
    const messageContent = message.trim();
    setMessage(''); // Clear input immediately for better UX
    
    try {
      setIsSending(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          content: messageContent,
          sender_id: user.id,
          receiver_id: receiverId
        });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      // Restore message to input on error
      setMessage(messageContent);
      
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex w-full gap-3">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 h-12 text-base rounded-xl border-2 border-amber-200/70 focus:border-amber-400 focus:ring-amber-400/20 bg-white/90 backdrop-blur-sm placeholder:text-muted-foreground/70"
        disabled={isSending}
        autoComplete="off"
        maxLength={1000}
      />
      <Button 
        type="submit" 
        disabled={isSending || !message.trim()}
        size="lg"
        className="h-12 px-6 bg-warm-gradient hover:shadow-warm text-white font-semibold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            <Send className="h-5 w-5" />
            <span className="ml-2 hidden sm:inline font-medium">Send</span>
          </>
        )}
      </Button>
    </form>
  );
};

export default MessagesInput;
