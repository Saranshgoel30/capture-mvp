
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { startMessageWithApplicant } from '@/lib/supabase/projectApplications';

interface MessageDialogProps {
  projectId: string;
  applicantId: string;
  applicantName: string;
  onClose: () => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ 
  projectId, 
  applicantId, 
  applicantName,
  onClose
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  
  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };
  
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    try {
      const success = await startMessageWithApplicant(projectId, applicantId, message);
      
      if (success) {
        toast({
          title: "Message sent",
          description: `Your message has been sent to ${applicantName}.`,
        });
        handleClose();
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message to {applicantName}</DialogTitle>
          <DialogDescription>
            Send a direct message regarding this project application.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message here..."
            rows={5}
          />
        </div>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            disabled={isSending || !message.trim()}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default MessageDialog;
