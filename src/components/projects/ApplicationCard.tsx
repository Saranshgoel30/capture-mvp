
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { startMessageWithApplicant } from '@/lib/supabase/projectApplications';

interface ApplicationCardProps {
  application: any; // Use any to handle both data structures
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

  // Extract applicant data from either data structure
  const applicantProfile = application.applicant_profile;
  const applicantName = applicantProfile?.full_name || 'Unnamed Applicant';
  const applicantAvatar = applicantProfile?.avatar_url || '';
  const applicationDate = application.created_at ? new Date(application.created_at).toLocaleDateString() : 'Unknown date';
  const applicationMotivation = application.cover_letter || application.motivation || '';
  
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
      // Extract the necessary IDs based on the data structure
      const projectId = application.project_id;
      const applicantId = application.applicant_id;
      
      if (!projectId || !applicantId) {
        throw new Error("Missing project or applicant information");
      }
      
      const success = await startMessageWithApplicant(projectId, applicantId, message);
      
      if (!success) {
        throw new Error("Failed to send message");
      }
      
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
          src={applicantAvatar}
          alt="Applicant Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{applicantName}</h3>
          <p className="text-sm text-muted-foreground">Applied on {applicationDate}</p>
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
            <DialogTitle>Message to {applicantName}</DialogTitle>
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
        <strong>Motivation:</strong> {applicationMotivation}
      </p>
      
      {isOwner && application.status === "pending" && (
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={handleAccept}
            variant="outline"
            className="text-green-500 border-green-500 hover:bg-green-50"
            disabled={isAccepting || isRejecting}
          >
            {isAccepting ? "Accepting..." : "Accept"}
          </Button>
          
          <Button
            onClick={handleReject}
            variant="destructive"
            className="hover:bg-red-50"
            disabled={isAccepting || isRejecting}
          >
            {isRejecting ? "Rejecting..." : "Reject"}
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
