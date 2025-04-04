
import React from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProjectApplication } from '@/lib/types';

interface MessageDialogProps {
  selectedApplication: ProjectApplication | null;
  message: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => Promise<void>;
  onCancel: () => void;
  isActionInProgress: boolean;
}

const MessageDialog: React.FC<MessageDialogProps> = ({
  selectedApplication,
  message,
  onMessageChange,
  onSendMessage,
  onCancel,
  isActionInProgress
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Message to {selectedApplication?.applicant?.name || 'Applicant'}</DialogTitle>
        <DialogDescription>
          This will start a conversation with the applicant.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        <Textarea
          placeholder="Write your message here..."
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={5}
          className="w-full"
        />
      </div>
      
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          onClick={onSendMessage}
          disabled={!message.trim() || isActionInProgress}
        >
          {isActionInProgress ? (
            <>
              <Clock className="animate-spin h-4 w-4 mr-1" /> Sending...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-1" /> Send Message
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default MessageDialog;
