
import React, { useState } from 'react';
import { Application } from '@/lib/supabase/types';
import Button from '@/components/ui-custom/Button'; // Fixed import
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Clock } from 'lucide-react';

interface ApplicationCardProps {
  application: Application & { applicant_profile: { avatar_url: string; full_name: string; }; };
  onAccept: () => void;
  onReject: () => void;
  isOwner: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onAccept, onReject, isOwner }) => {
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
      toast({
        title: "Application Accepted",
        description: "You have accepted this application.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to accept application.",
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await onReject();
      toast({
        title: "Application Rejected",
        description: "You have rejected this application.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject application.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    try {
      // Here you would implement the message sending functionality
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the applicant.",
      });
      setMessage('');
      setIsMessageDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-card">
      <div className="flex items-center space-x-4">
        <img
          src={application.applicant_profile?.avatar_url}
          alt="Applicant Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{application.applicant_profile?.full_name}</h3>
          <p className="text-sm text-muted-foreground">Applied on {new Date(application.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="mt-2">
            Message
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message to {application.applicant_profile?.full_name || 'Applicant'}</DialogTitle>
            <DialogDescription>
              This will start a conversation with the applicant.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <Textarea
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isSendingMessage}
            >
              {isSendingMessage ? (
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
      </Dialog>
      
      <p className="mt-2 text-sm">
        <strong>Motivation:</strong> {application.motivation}
      </p>
      
      {isOwner && application.status === "pending" && (
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={handleAccept}
            variant="outline"
            className="text-green-500 border-green-500 hover:bg-green-50"
            isLoading={isAccepting}
            disabled={isAccepting || isRejecting}
          >
            Accept
          </Button>
          
          <Button
            onClick={handleReject}
            variant="destructive"
            className="hover:bg-red-50"
            isLoading={isRejecting}
            disabled={isAccepting || isRejecting}
          >
            Reject
          </Button>
        </div>
      )}
      
      {!isOwner && (
        <div className="mt-4">
          <p className="text-sm"><strong>Status:</strong> {application.status}</p>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
