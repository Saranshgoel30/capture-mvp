
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { sendMessage } from '@/lib/supabase/messages';
import { useAuth } from '@/contexts/AuthContext';

interface MessagesInputProps {
  receiverId: string;
}

const MessagesInput: React.FC<MessagesInputProps> = ({ receiverId }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !receiverId || !message.trim()) return;
    
    setIsSending(true);
    try {
      await sendMessage(user.id, receiverId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <form onSubmit={handleSendMessage} className="flex gap-2">
      <Input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={isSending}
        className="flex-1"
      />
      <Button type="submit" disabled={isSending || !message.trim()}>
        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
};

export default MessagesInput;
