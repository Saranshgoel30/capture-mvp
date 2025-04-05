import React, { useState } from 'react';
import { Application } from '@/lib/supabase/types';
import { Button } from '@/components/ui-custom/Button';
import { useToast } from '@/hooks/use-toast';
import MessageDialog from '../messages/MessageDialog';

interface ApplicationCardProps {
  application: Application & { applicant_profile: { avatar_url: string; full_name: string; }; };
  onAccept: () => void;
  onReject: () => void;
  isOwner: boolean;
}

// Within the ApplicationCard component where the MessageDialog is used
const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onAccept, onReject, isOwner }) => {
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [messageDialogTrigger, setMessageDialogTrigger] = useState<React.ReactNode>(null);

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

  // Fix the MessageDialog props
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
      
      {messageDialogTrigger || setMessageDialogTrigger(
        <Button variant="ghost" size="sm" onClick={() => setMessageDialogTrigger(
          <Button variant="ghost" size="sm">
            Message
          </Button>
        )}>
          Message
        </Button>
      )}
      {messageDialogTrigger && (
        <MessageDialog 
          userId={application.applicant_id} // Changed from receiverId to userId to match expected props
          triggerButton={messageDialogTrigger}
        />
      )}
      
      <p className="mt-2 text-sm">
        <strong>Motivation:</strong> {application.motivation}
      </p>
      
      {isOwner && application.status === "pending" && (
        <div className="flex space-x-2 mt-4">
          <Button
            onClick={handleAccept}
            // Fix variant to use only allowed values
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
