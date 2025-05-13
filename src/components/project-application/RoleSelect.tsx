
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormLabel } from '@/components/ui/form';

interface RoleSelectProps {
  roles: string[];
  selectedRole: string;
  onRoleChange: (role: string) => void;
  disabled?: boolean;
}

const RoleSelect: React.FC<RoleSelectProps> = ({ 
  roles, 
  selectedRole, 
  onRoleChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>Select Role</FormLabel>
      <Select 
        value={selectedRole} 
        onValueChange={onRoleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a role to apply for" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role, index) => (
            <SelectItem key={index} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!selectedRole && (
        <p className="text-sm text-muted-foreground">
          Choose a role that best matches your skills
        </p>
      )}
    </div>
  );
};

export default RoleSelect;
