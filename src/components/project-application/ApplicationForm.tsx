
import React, { useState } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { applyForProject } from '@/lib/supabase';
import RoleSelect from './RoleSelect';

interface ApplicationFormProps {
  projectId: string;
  userId: string;
  rolesNeeded: string[];
  isExpired: boolean;
  onApplicationSubmitted: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ 
  projectId, 
  userId, 
  rolesNeeded, 
  isExpired,
  onApplicationSubmitted
}) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();
  
  const handleApply = async () => {
    if (!selectedRole) {
      toast({
        title: 'Role Required',
        description: 'Please select a role you want to apply for.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsApplying(true);
    try {
      await applyForProject(projectId, userId, coverLetter, selectedRole);
      toast({
        title: 'Application Submitted',
        description: `Your application for the role of ${selectedRole} has been successfully submitted!`,
      });
      onApplicationSubmitted();
    } catch (error) {
      console.error('Error applying to project:', error);
      toast({
        title: 'Application Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <RoleSelect
        roles={rolesNeeded}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        disabled={isExpired || isApplying}
      />
      
      <div className="space-y-2">
        <FormLabel>Cover Letter</FormLabel>
        <Textarea
          placeholder="Write a brief message explaining why you're a good fit for this role..."
          className="mb-4"
          rows={5}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          disabled={isApplying || isExpired}
        />
      </div>
      
      <Button 
        className="w-full" 
        onClick={handleApply}
        disabled={isApplying || isExpired || !selectedRole}
      >
        {isApplying ? (
          <>
            <span className="mr-2">Submitting...</span>
            <div className="animate-spin">
              <Clock className="h-4 w-4" />
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Apply Now
          </>
        )}
      </Button>
      {isExpired && (
        <p className="text-destructive text-sm mt-2">
          This project has passed its deadline and is no longer accepting applications.
        </p>
      )}
    </div>
  );
};

export default ApplicationForm;
